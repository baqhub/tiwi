import type {FC} from "react";
import {tiwi} from "#/index.ts";

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

// Accept a component whose className is widened beyond string.
//
// Mirrors React Native's Animated.View: Uniwind adds className via module
// augmentation, then Animated widens it to also accept animated values. A
// string is still assignable to it, so tiwi should accept the component.
{
  type AnimatedNode = {__animatedNode: true};
  type AnimatedViewProps = {className?: string | AnimatedNode; style?: unknown};
  const AnimatedView = (_: AnimatedViewProps) => <></>;
  const Styled = tiwi(AnimatedView)``;
  const _test = <Styled style={{}} />;
}

// Fail on a component that has props but no className.
{
  const Component = (_: {style?: unknown}) => <></>;
  // @ts-expect-error No className.
  const _Test = tiwi(Component);
}

// Fail on a component whose className can't accept a string.
{
  const Component = (_: {className?: number}) => <></>;
  // @ts-expect-error className can't take a string.
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
