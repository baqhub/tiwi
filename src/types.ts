import type {
  ComponentProps,
  ComponentRef,
  ElementType,
  JSX,
  NamedExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from "react";

//
// Tiwi component definition.
//

export interface TiwiProps {
  className?: string;
}

export type TiwiVariants<T extends string> = {
  [K in T]?: string;
};

//
// Tiwi component props.
//

type TiwiVariantsMap<T extends string> = {
  [K in T]?: boolean;
};

export type TiwiVariantsProp<T extends string> =
  | TiwiVariantsMap<T>
  | ReadonlyArray<T | undefined>
  | T
  | false
  | null
  | undefined;

export type TiwiComponentProps<T extends string> = [T] extends [never]
  ? {}
  : {variants: TiwiVariantsProp<T>};

export type PropsWithoutVariants<P> = P extends any
  ? "variants" extends keyof P
    ? Omit<P, "variants">
    : P
  : P;

//
// Function.
//

export const tiwiComponentSymbol: unique symbol = Symbol("TiwiComponent");

export interface TiwiExoticComponent<
  TProps extends object,
  TRef,
  TVariant extends string,
> extends NamedExoticComponent<
  PropsWithoutRef<PropsWithoutVariants<TProps> & TiwiComponentProps<TVariant>> &
    RefAttributes<TRef>
> {
  [tiwiComponentSymbol]: true;
}

export type VariantsOf<T extends TiwiExoticComponent<any, any, any>> =
  T extends TiwiExoticComponent<any, any, infer TVariants> ? TVariants : never;

export interface TiwiBuilder<
  TProps extends object,
  TRef,
  TVariant extends string = never,
> {
  <T extends string = never>(
    classNames: TemplateStringsArray,
    ...variantDefinitions: TiwiVariants<T>[]
  ): TiwiExoticComponent<TProps, TRef, T | TVariant>;
}

// Ensure the Element accepts a `className` prop we can hand a string to.
//
// We check that a `string` is assignable *to* the component's `className`
// rather than that the component's `className` is assignable to `string`.
// The latter (the obvious `Props extends TiwiProps`) breaks for wrappers like
// React Native's `Animated.View`: Uniwind adds `className` via module
// augmentation, then `Animated` widens it to also accept animated values
// (e.g. `string | AnimatedNode`), which is no longer assignable to `string`.
// Checking the other direction still accepts those while rejecting components
// that have no `className` prop (or one that can't take a string).
export type ElementWithTiwiProps<E> =
  E extends ElementType<infer Props>
    ? "className" extends keyof Props
      ? string extends Props["className"]
        ? E
        : never
      : never
    : never;

export interface TiwiFunction {
  <E extends ElementType>(
    Element: ElementWithTiwiProps<E>
  ): TiwiBuilder<
    ComponentProps<E>,
    ComponentRef<E>,
    E extends TiwiExoticComponent<any, any, infer T> ? T : never
  >;
}

export type IntrinsicElementsBuilderMap = {
  [K in keyof JSX.IntrinsicElements]: TiwiBuilder<
    JSX.IntrinsicElements[K],
    ComponentRef<K>
  >;
};

export interface Tiwi extends TiwiFunction, IntrinsicElementsBuilderMap {}
