import {render} from "@testing-library/react";
import {ReactNode} from "react";
import {describe, expect, test} from "vitest";
import tiwi from "../tiwi.js";

function renderNode(element: ReactNode) {
  const {container} = render(element);
  return container.firstChild;
}

describe("Basic function", () => {
  test("Render intrinsic with no class", () => {
    // Prepare.
    const Header = tiwi.header``;

    // Act.
    const actual = renderNode(<Header />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`<header />`);
  });

  test("Render intrinsic with style", () => {
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

  test("Render intrinsic with class", () => {
    // Prepare.
    const Header = tiwi.header``;

    // Act.
    const actual = renderNode(<Header className="text-amber-500" />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="text-amber-500"
      />
    `);
  });

  test("Render intrinsic with class override", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200
    `;

    // Act.
    const actual = renderNode(<Header className="text-amber-500" />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="text-amber-500"
      />
    `);
  });

  test("Render intrinsic with class override and other style", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200
      bg-red-200
    `;

    // Act.
    const actual = renderNode(<Header className="text-amber-500" />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="bg-red-200 text-amber-500"
      />
    `);
  });

  test("Render intrinsic with non-tailwind class", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200
    `;

    // Act.
    const actual = renderNode(<Header className="custom-header" />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="text-amber-200 custom-header"
      />
    `);
  });
});

describe("Variants", () => {
  test("Single variant: disabled", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-500

      ${{
        isDisabled: `
          text-amber-200
        `,
      }}
    `;

    // Act.
    const actual1 = renderNode(<Header />);
    const actual2 = renderNode(<Header variants={[]} />);
    const actual3 = renderNode(<Header variants={{}} />);
    const actual4 = renderNode(<Header variants={{isDisabled: false}} />);

    // Assert.
    expect(actual1).toMatchInlineSnapshot(`
      <header
        class="text-amber-500"
      />
    `);
    expect(actual2).toMatchInlineSnapshot(`
      <header
        class="text-amber-500"
      />
    `);
    expect(actual3).toMatchInlineSnapshot(`
      <header
        class="text-amber-500"
      />
    `);
    expect(actual4).toMatchInlineSnapshot(`
      <header
        class="text-amber-500"
      />
    `);
  });

  test("Single variant: enabled", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-500

      ${{
        isDisabled: `
          text-amber-200
        `,
      }}
    `;

    // Act.
    const actual1 = renderNode(<Header variants="isDisabled" />);
    const actual2 = renderNode(<Header variants={["isDisabled"]} />);
    const actual3 = renderNode(<Header variants={{isDisabled: true}} />);

    // Assert.
    expect(actual1).toMatchInlineSnapshot(`
      <header
        class="text-amber-200"
      />
    `);
    expect(actual2).toMatchInlineSnapshot(`
      <header
        class="text-amber-200"
      />
    `);
    expect(actual3).toMatchInlineSnapshot(`
      <header
        class="text-amber-200"
      />
    `);
  });

  test("Variant with no base style", () => {
    // Prepare.
    const Header = tiwi.header`
      ${{
        isDisabled: `
          text-amber-200
        `,
      }}
    `;

    // Act.
    const actualWithoutVariant = renderNode(<Header />);
    const actualWithVariant = renderNode(<Header variants="isDisabled" />);

    // Assert.
    expect(actualWithoutVariant).toMatchInlineSnapshot(`<header />`);
    expect(actualWithVariant).toMatchInlineSnapshot(`
      <header
        class="text-amber-200"
      />
    `);
  });
});
