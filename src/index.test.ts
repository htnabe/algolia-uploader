import path from "node:path";
import { runCommand as runCittyCommand } from "citty";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { main } from "./index";

const mocks = vi.hoisted(() => {
  const retrieveDataFromFiles = vi.fn();
  const retrieveDataFromDir = vi.fn();
  const showAuthors = vi.fn();
  const getInstance = vi.fn(() => ({ provider: "test-provider" }));
  const uploadObjects = vi.fn();
  const Uploader = vi.fn(function (
    this: { uploadObjects: typeof uploadObjects },
    _provider: unknown,
  ) {
    this.uploadObjects = uploadObjects;
  });

  return {
    retrieveDataFromFiles,
    retrieveDataFromDir,
    showAuthors,
    getInstance,
    uploadObjects,
    Uploader,
  };
});

vi.mock("./features/dataFiles/retrieveDataFromFiles", () => ({
  retrieveDataFromFiles: mocks.retrieveDataFromFiles,
}));

vi.mock("./features/dataDir/retrieveDataFromDir", () => ({
  retrieveDataFromDir: mocks.retrieveDataFromDir,
}));

vi.mock("./features/authors/showAuthors", () => ({
  showAuthors: mocks.showAuthors,
}));

vi.mock("./utils/AlgoliaClientProvider", () => ({
  AlgoliaClientProvider: {
    getInstance: mocks.getInstance,
  },
}));

vi.mock("./utils/Uploader", () => ({
  Uploader: mocks.Uploader,
}));

type MainContext = Parameters<NonNullable<typeof main.run>>[0];

const runMain = (args: MainContext["args"]): Promise<unknown> =>
  main.run?.({ args } as MainContext) ?? Promise.resolve();

beforeEach(() => {
  vi.resetAllMocks();
  delete process.env.DATA_DIR;
  mocks.retrieveDataFromFiles.mockResolvedValue([]);
  mocks.retrieveDataFromDir.mockResolvedValue([]);
  mocks.getInstance.mockReturnValue({ provider: "test-provider" });
  mocks.uploadObjects.mockResolvedValue(undefined);
  mocks.Uploader.mockImplementation(function (
    this: { uploadObjects: typeof mocks.uploadObjects },
    _provider: unknown,
  ) {
    this.uploadObjects = mocks.uploadObjects;
  });
});

describe("CLI file list handling", () => {
  it("calls retrieveDataFromFiles for each path provided via --data-files", async () => {
    const cwd = process.cwd();
    const items = [{ objectID: "item-001" }];
    mocks.retrieveDataFromFiles.mockResolvedValue(items);

    await runMain({
      dataFiles: "foo.json",
      _: ["/abs/bar.json"],
    } as MainContext["args"]);

    expect(mocks.retrieveDataFromFiles).toHaveBeenCalledTimes(1);
    const calledWith = mocks.retrieveDataFromFiles.mock.calls[0][0] as string[];
    expect(calledWith[0]).toBe(path.resolve(cwd, "foo.json"));
    expect(calledWith[1]).toBe("/abs/bar.json");
    expect(mocks.getInstance).toHaveBeenCalledTimes(1);
    expect(mocks.Uploader).toHaveBeenCalledTimes(1);
    expect(mocks.uploadObjects).toHaveBeenCalledWith(items);
  });

  it("combines --data-files with additional space-separated paths via real CLI parsing", async () => {
    const cwd = process.cwd();
    const items = [{ objectID: "item-001" }];
    mocks.retrieveDataFromFiles.mockResolvedValue(items);

    await runCittyCommand(main, {
      rawArgs: ["--data-files", "foo.json", "/abs/bar.json"],
    });

    expect(mocks.retrieveDataFromFiles).toHaveBeenCalledTimes(1);
    const calledWith = mocks.retrieveDataFromFiles.mock.calls[0][0] as string[];
    expect(calledWith[0]).toBe(path.resolve(cwd, "foo.json"));
    expect(calledWith[1]).toBe("/abs/bar.json");
  });

  it("does not upload when --data-files resolves to no items", async () => {
    await runMain({ dataFiles: "foo.json" } as MainContext["args"]);

    expect(mocks.retrieveDataFromFiles).toHaveBeenCalledTimes(1);
    expect(mocks.Uploader).not.toHaveBeenCalled();
  });

  it("trims whitespace and drops empty positional paths", async () => {
    const cwd = process.cwd();
    const items = [{ objectID: "item-001" }];
    mocks.retrieveDataFromFiles.mockResolvedValue(items);

    await runMain({
      dataFiles: "  foo.json  ",
      _: ["", "  /abs/bar.json  ", "   "],
    } as MainContext["args"]);

    expect(mocks.retrieveDataFromFiles).toHaveBeenCalledTimes(1);
    const calledWith = mocks.retrieveDataFromFiles.mock.calls[0][0] as string[];
    expect(calledWith).toEqual([
      path.resolve(cwd, "foo.json"),
      "/abs/bar.json",
    ]);
  });

  it("rejects positional args", async () => {
    const exit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await runMain({ _: ["a.json"] } as MainContext["args"]);

    expect(exit).toHaveBeenCalledWith(1);
    expect(mocks.retrieveDataFromFiles).not.toHaveBeenCalled();
  });

  it("rejects unknown option-shaped args", async () => {
    const exit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await runCittyCommand(main, {
      rawArgs: ["--data-files", "hoge.json", "--hige.json"],
    });

    expect(exit).toHaveBeenCalledWith(1);
    expect(mocks.retrieveDataFromFiles).not.toHaveBeenCalled();
  });

  it("shows authors and exits early when --authors is provided", async () => {
    await runMain({ authors: true } as MainContext["args"]);

    expect(mocks.showAuthors).toHaveBeenCalledTimes(1);
    expect(mocks.retrieveDataFromFiles).not.toHaveBeenCalled();
    expect(mocks.retrieveDataFromDir).not.toHaveBeenCalled();
  });

  it("falls back to DATA_DIR, resolves it, and uploads the loaded items", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const items = [{ objectID: "item-001" }];
    process.env.DATA_DIR = "./fixtures/data";
    mocks.retrieveDataFromDir.mockResolvedValue(items);

    await runMain({} as MainContext["args"]);

    expect(warnSpy).toHaveBeenCalledWith(
      "Deprecated: The DATA_DIR environment variable will not be supported as of v0.0.22.",
    );
    expect(mocks.retrieveDataFromDir).toHaveBeenCalledWith(
      path.resolve(process.cwd(), "./fixtures/data"),
    );
    expect(mocks.uploadObjects).toHaveBeenCalledWith(items);
  });

  it("reports an error when neither --data-files nor DATA_DIR is provided", async () => {
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await runMain({} as MainContext["args"]);

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalledWith(
      "Error: no data path provided. Use --data-files or set DATA_DIR env.",
    );
  });

  it("reports unexpected downstream errors and exits", async () => {
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new Error("boom");
    mocks.retrieveDataFromFiles.mockRejectedValue(failure);

    await runMain({ dataFiles: "foo.json" } as MainContext["args"]);

    expect(errorSpy).toHaveBeenCalledWith("Some errors occurred: ", failure);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
