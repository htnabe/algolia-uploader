import path from "node:path";
import { runCommand as runCittyCommand } from "citty";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { retrieveDataFromFiles } from "./features/dataFiles/retrieveDataFromFiles";
import { main } from "./index";

vi.mock("../src/features/dataFiles/retrieveDataFromFiles", () => ({
  retrieveDataFromFiles: vi.fn(),
}));

type MainContext = Parameters<NonNullable<typeof main.run>>[0];

const runMain = (args: MainContext["args"]): Promise<unknown> =>
  main.run?.({ args } as MainContext) ?? Promise.resolve();

beforeEach(() => {
  vi.resetAllMocks();
});

describe("CLI file list handling", () => {
  it("calls retrieveDataFromFiles for each path provided via --data-files", async () => {
    const cwd = process.cwd();
    const input = "foo.json, /abs/bar.json";

    await runMain({ dataFiles: input } as MainContext["args"]);

    expect(vi.mocked(retrieveDataFromFiles).mock.calls.length).toBe(1);
    const calledWith = vi.mocked(retrieveDataFromFiles).mock
      .calls[0][0] as string[];
    expect(calledWith[0]).toBe(path.resolve(cwd, "foo.json"));
    expect(calledWith[1]).toBe("/abs/bar.json");
  });

  it("rejects positional args", async () => {
    const exit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await runMain({ _: ["a.json"] } as MainContext["args"]);

    expect(exit).toHaveBeenCalledWith(1);
    expect(retrieveDataFromFiles).not.toHaveBeenCalled();
  });

  it("rejects unknown option-shaped args", async () => {
    const exit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await runCittyCommand(main, {
      rawArgs: ["--data-files", "hoge.json", "--hige.json"],
    });

    expect(exit).toHaveBeenCalledWith(1);
    expect(retrieveDataFromFiles).not.toHaveBeenCalled();
  });
});
