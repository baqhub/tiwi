# tiwi &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/baqhub/tiwi/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@baqhub/sdk.svg?color=)](https://www.npmjs.com/package/tiwi)

Tiwi is a [React](https://react.dev/) library that makes it easy to create components with [Tailwind](https://tailwindcss.com/) styles baked in. This makes it straightforward to preserve the separation of concern between structure and style, similar to [styled-components](https://styled-components.com/). It also comes with a powerful variants system for more advanced use cases.

This library works with both React on the web and [React Native](https://reactnative.dev/).

## Getting started

### 1. Tailwind

[Install and configure](https://tailwindcss.com/docs/installation) TailwindCSS in your project.

### 2. Tiwi

```bash
npm install tiwi
```

### 3. VSCode

For the best experience, install the official [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension.

The following configuration will allow the extension to work with Tiwi:

```jsonc
"editor.quickSuggestions": {
  "strings": "on" // As-you-type suggestions within strings.
},
"tailwindCSS.experimental.classRegex": [
  [
    "(?:tiwi|tw)[.(][^`]+([^;]*)",
    "[\"'`\\}]([^\"'`\\$]*)[\"'`\\$]"
  ]
]
```

## Basic usage

Import Tiwi in your component file:

```tsx
import tiwi from "tiwi";
```

You can now create Tiwi components:

```tsx
const Button = tiwi.button`
  rounded
  bg-blue-300
`;
```

These can be used like any other component:

```tsx
<Button />

// Renders as:
// <button class="rounded bg-blue-300" />
```

Classes can still be overridden inline:

```tsx
<Button className="bg-red-300" />

// Renders as:
// <button class="rounded bg-red-300" />
```

Other props work as expected:

```tsx
<Button type="submit">Submit</Button>

// Renders as:
// <button class="rounded bg-blue-300" type="submit">Submit</button>
```

Tiwi components can be further extended:

```tsx
const BigButton = tiwi(Button)`
  text-lg
`;

// Renders as:
// <button class="rounded bg-blue-300 text-lg" />
```

When extending, styles can be overwritten:

```tsx
const RedButton = tiwi(Button)`
  bg-red-300
`;

// Renders as:
// <button class="rounded bg-red-300" />
```

Any component with a `className` prop can be extended:

```tsx
const SubmitButton: FC<{className?: string}> = props => {
  return (
    <button className={props.className} type="submit">
      Submit
    </button>
  );
};

const RedSubmitButton = tiwi(SubmitButton)`
  bg-red-300
`;

// Renders as:
// <button class="bg-red-300" type="submit">Submit</button>
```

## Variants

What makes Tiwi so powerful is its support for variants. This enables changes to be made to the style of a component along multiple dimensions without creating every permutation separately.

Here's a simple variant to support multiple sizes:

```tsx
const SizeButton = tiwi.button`
  m-1
  p-2
  text-normal

  ${{
    medium: `
      p-3
      text-lg
    `,
    large: `
      p-5
      text-xl
    `,
  }}
`;
```

The variants to use can then be provided in different ways:

```tsx
<SizeButton />

// Renders as:
// <button class="m-1 p-2 text-normal" />

<SizeButton variants="medium" />
<SizeButton variants={["medium"]} />
<SizeButton variants={{medium: true}} />

// All render as:
// <button class="m-1 p-3 text-lg" />
```

If multiple variants overlap, the last one wins:

```tsx
<SizeButton variants={["medium", "large"]} />
<SizeButton variants={{medium: true, large: true}} />

// Both render as:
// <button class="m-1 p-5 text-xl" />
```

Variants can be specified along separate dimensions:

```tsx
const FlexButton = tiwi.button`
  p-2
  text-normal
  bg-blue-300

  ${{
    medium: `
      p-3
      text-lg
    `,
    large: `
      p-5
      text-xl
    `,
  }}

  ${{
    primary: `
      bg-green-300
    `,
    critical: `
      bg-red-300
    `,
  }}
`;
```

```tsx
<FlexButton variants={["medium", "critical"]} />
<FlexButton variants={{medium: true, critical: true}} />

// Both render as:
// <button class="p-3 text-lg bg-red-300" />
```

## React Native

## Full example

```tsx
// tooltip.tsx

import {FC, PropsWithChildren, ReactNode} from "react";
import tiwi from "tiwi";

//
// Props.
//

type TooltipVariant = "normal" | "important";

interface TooltipProps extends PropsWithChildren {
  variant?: TooltipVariant;
  icon: ReactNode;
}

//
// Style.
//

const Layout = tiwi.div<TooltipVariant>`
  flex
  flex-row

  rounded
  p-2
  gap-1

  bg-neutral-200

  ${{
    important: `bg-red-200`,
  }}
`;

const Icon = tiwi.div`
  w-5
  h-5
`;

const Text = tiwi.div`
  text-neutral-900
  font-medium
`;

//
// Component.
//

export const Tooltip: FC<TooltipProps> = props => {
  const {variant, icon, children} = props;
  return (
    <Layout variants={variant}>
      <Icon>{icon}</Icon>
      <Text>{children}</Text>
    </Layout>
  );
};
```

## Acknowledgements

This library was inspired by [Tailwind-Styled-Component](https://github.com/MathiasGilson/Tailwind-Styled-Component/tree/master) and borrows some of its ideas. It also heavily relies on [tailwind-merge](https://github.com/dcastil/tailwind-merge) for the underlying class manipulation and shares the same [limitations](https://github.com/dcastil/tailwind-merge/blob/v2.5.4/docs/limitations.md).

## License

Tiwi is [MIT licensed](https://github.com/baqhub/tiwi/blob/main/LICENSE).