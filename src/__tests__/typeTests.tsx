import {FC} from "react";
import tiwi from "../tiwi.js";

// Find props on intrinsic element.
{
  const Link = tiwi.a``;

  const _test1 = <Link href="/home" />;
  const _test2 = Link({href: "/home"});
}

// Fail on extra props on intrinsic element.
{
  const Header = tiwi.header``;

  // @ts-expect-error Unsupported "href" prop.
  const _test1 = <Header href="/home" />;
  // @ts-expect-error Unsupported "href" prop.
  const _test2 = Header({href: "/home"});
}

// Accept component with className.
{
  type Props = {className?: string};
  const Component = (_: Props) => <></>;
  const _Test = tiwi(Component);
}

// Fail on component without className.
{
  const Component = () => <></>;
  // @ts-expect-error No className.
  const _Test = tiwi(Component);
}

// Fail on FC without className.
{
  const Component: FC = () => <></>;
  // @ts-expect-error No className.
  const _Test = tiwi(Component);
}

// Pass along props.
{
  type Props = {className?: string; isEnabled: boolean};
  const Component: FC<Props> = () => <></>;
  const StyledComponent = tiwi(Component)``;
  const _test = <StyledComponent isEnabled />;
}

// Fail on missing required prop.
{
  type Props = {className?: string; isEnabled: boolean};
  const Component: FC<Props> = () => <></>;
  const StyledComponent = tiwi(Component)``;
  // @ts-expect-error Missing prop.
  const _test = <StyledComponent />;
}
