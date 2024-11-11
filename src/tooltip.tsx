import {FC, PropsWithChildren, ReactNode} from "react";
import tiwi from "./tiwi.js";

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

const MegaLayout = tiwi(Layout)`
  bg-red-300
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
