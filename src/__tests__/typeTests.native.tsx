import type {FC} from "react";
import {tiwi} from "#/native.ts";

// Wrap a component with className.
{
  type Props = {className?: string};
  const Component: FC<Props> = () => <></>;
  const _Styled = tiwi(Component)``;
}

// Intrinsic element builders are not available on the native entry.
{
  // @ts-expect-error No intrinsic elements on the native entry.
  const _NoDiv = tiwi.div;
}
