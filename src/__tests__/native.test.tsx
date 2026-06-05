import {describe, expect, test} from "vitest";
import nativeTiwi, {tiwi, tw} from "#/native.ts";

describe("Native entry", () => {
  test("Exposes the tiwi function", () => {
    expect(typeof tiwi).toBe("function");
    expect(tw).toBe(tiwi);
    expect(nativeTiwi).toBe(tiwi);
  });

  test("Has no intrinsic element builders", () => {
    expect((tiwi as any).div).toBeUndefined();
    expect((tiwi as any).span).toBeUndefined();
  });

  test("Wraps a component", () => {
    const Component = (props: {className?: string}) => (
      <div className={props.className} />
    );
    const Styled = tiwi(Component)`text-amber-500`;
    expect(typeof Styled).toBe("object");
  });
});
