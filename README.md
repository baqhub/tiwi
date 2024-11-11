# tiwi &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/baqhub/tiwi/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@baqhub/sdk.svg?color=)](https://www.npmjs.com/package/tiwi)

## Installation

```bash
npm install tiwi
```

## Documentation

### Getting started

### Variants

### React Native

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
