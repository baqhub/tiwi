import {render} from "@testing-library/react";
import {FC, ReactNode} from "react";
import {describe, expect, test} from "vitest";
import tiwi from "../tiwi.js";

function renderNode(element: ReactNode) {
  const {container} = render(element);
  return container.firstChild;
}

describe("Basic function with intrinsic elements", () => {
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

  test("Render intrinsic with inheritance", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200
    `;

    const BigHeader = tiwi(Header)`
      text-lg
    `;

    // Act.
    const actual = renderNode(<BigHeader />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="text-amber-200 text-lg"
      />
    `);
  });
});

describe("Basic function with custom component", () => {
  interface MyComponentProps {
    className?: string;
    isDisabled?: boolean;
  }

  const MyComponent: FC<MyComponentProps> = props => {
    const {className, isDisabled} = props;
    return (
      <div className={className}>{isDisabled ? "disabled" : "enabled"}</div>
    );
  };

  test("Render with no class", () => {
    // Prepare.
    const StyledComponent = tiwi(MyComponent)``;

    // Act.
    const actual = renderNode(<StyledComponent />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <div>
        enabled
      </div>
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

  test("Multi variants with no overlap", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200

      ${{
        large: `
          p-20
        `,
        red: `
          bg-red-400
        `,
      }}
    `;

    // Act.
    const actualWithoutVariant = renderNode(<Header />);
    const actualWithSingleVariant = renderNode(<Header variants="large" />);
    const actualWithAllVariants = renderNode(
      <Header variants={["large", "red"]} />
    );

    // Assert.
    expect(actualWithoutVariant).toMatchInlineSnapshot(`
      <header
        class="text-amber-200"
      />
    `);
    expect(actualWithSingleVariant).toMatchInlineSnapshot(`
      <header
        class="text-amber-200 p-20"
      />
    `);
    expect(actualWithAllVariants).toMatchInlineSnapshot(`
      <header
        class="text-amber-200 p-20 bg-red-400"
      />
    `);
  });

  test("Multi variants with overlap", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200

      ${{
        color1: `
          text-amber-300
        `,
        color2: `
          text-amber-400
        `,
      }}
    `;

    // Act.
    const actualWithoutVariant = renderNode(<Header />);
    const actualWithSingleVariant = renderNode(<Header variants="color1" />);
    const actualWithAllVariants = renderNode(
      <Header variants={["color1", "color2"]} />
    );

    // Assert.
    expect(actualWithoutVariant).toMatchInlineSnapshot(`
      <header
        class="text-amber-200"
      />
    `);
    expect(actualWithSingleVariant).toMatchInlineSnapshot(`
      <header
        class="text-amber-300"
      />
    `);
    expect(actualWithAllVariants).toMatchInlineSnapshot(`
      <header
        class="text-amber-400"
      />
    `);
  });

  test("Multi variants overwrite order", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200

      ${{
        color1: `
          text-amber-300
        `,
      }}

      text-amber-400

      ${{
        color2: `
          text-amber-500
        `,
      }}
    `;

    // Act.
    const actualWithoutVariant = renderNode(<Header />);
    const actualWithVariant1 = renderNode(<Header variants="color1" />);
    const actualWithVariant2 = renderNode(<Header variants="color2" />);

    // Assert.
    expect(actualWithoutVariant).toMatchInlineSnapshot(`
      <header
        class="text-amber-400"
      />
    `);
    expect(actualWithVariant1).toMatchInlineSnapshot(`
      <header
        class="text-amber-400"
      />
    `);
    expect(actualWithVariant2).toMatchInlineSnapshot(`
      <header
        class="text-amber-500"
      />
    `);
  });

  test("Explicit variant types", () => {
    // Prepare.
    type Variants = "small" | "large";
    const Header = tiwi.header<Variants>`
      text-amber-200

      p-0
      ${{
        small: `p-2`,
        large: `p-3`,
      }}
    `;

    // Act.
    const actualWithoutVariant = renderNode(<Header />);
    const actualWithVariant1 = renderNode(<Header variants="small" />);
    const actualWithVariant2 = renderNode(<Header variants="large" />);

    // Assert.
    expect(actualWithoutVariant).toMatchInlineSnapshot(`
      <header
        class="text-amber-200 p-0"
      />
    `);
    expect(actualWithVariant1).toMatchInlineSnapshot(`
      <header
        class="text-amber-200 p-2"
      />
    `);
    expect(actualWithVariant2).toMatchInlineSnapshot(`
      <header
        class="text-amber-200 p-3"
      />
    `);
  });

  test("Accept object with more properties", () => {
    // Prepare.
    const props = {
      isDisabled: true,
      isFocused: true,
    };

    const Header = tiwi.header`
      text-amber-200

      ${{
        isDisabled: `text-amber-300`,
      }}
    `;

    // Act.
    const actual = renderNode(<Header variants={props} />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="text-amber-300"
      />
    `);
  });

  test("Variants with inheritance", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200

      ${{
        isDisabled: `text-amber-300`,
      }}
    `;

    const TopHeader = tiwi(Header)`
      text-lg
    `;

    // Act.
    const actual = renderNode(<TopHeader variants="isDisabled" />);

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="text-amber-300 text-lg"
      />
    `);
  });

  test("Variants with inheritance and more variants", () => {
    // Prepare.
    const Header = tiwi.header`
      text-amber-200

      ${{
        isDisabled: `text-amber-300`,
      }}
    `;

    const TopHeader = tiwi(Header)`
      text-lg

      ${{
        isFocused: `bg-red-100`,
      }}
    `;

    // Act.
    const actual = renderNode(
      <TopHeader variants={["isFocused", "isDisabled"]} />
    );

    // Assert.
    expect(actual).toMatchInlineSnapshot(`
      <header
        class="text-amber-300 text-lg bg-red-100"
      />
    `);
  });
});
