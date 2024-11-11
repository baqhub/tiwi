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

```json
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

## Variants

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

## License

Tiwi is [MIT licensed](https://github.com/baqhub/tiwi/blob/main/LICENSE).
