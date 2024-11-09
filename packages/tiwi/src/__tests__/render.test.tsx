import {render} from "@testing-library/react";
import {ReactNode} from "react";
import {describe, expect, test} from "vitest";
import tiwi from "../tiwi.js";

function renderNode(element: ReactNode) {
  const {container} = render(element);
  return container.firstChild;
}

describe("tiwi()", () => {
  test("Render intrinsic with no class", () => {
    // Prepare.
    const Header = tiwi.header``;

    // Act.
    const actual = renderNode(<Header />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`<header />`);
  });

  test("Render intrinsic with simple class", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-500
    `;

    // Act.
    const actual = renderNode(<Header />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="text-amber-500"
      />
    `);
  });
});
