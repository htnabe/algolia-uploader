import { describe, expect, it, vi } from "vitest";
import { showAuthors } from "@/features/authors/showAuthors";

describe("showAuthors", () => {
  it("Show authors contact", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    showAuthors();

    expect(spy).toHaveBeenCalledWith("https://t-pot.me/author");
  });
});
