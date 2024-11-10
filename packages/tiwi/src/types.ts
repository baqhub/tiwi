import {
  ComponentProps,
  ComponentRef,
  ElementRef,
  ElementType,
  ExoticComponent,
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

export type IsUnion<T, U extends T = T> = (
  T extends any ? (U extends T ? false : true) : never
) extends false
  ? false
  : true;

export type TiwiVariantsProp<T extends string> =
  | TiwiVariantsMap<T>
  | ReadonlyArray<T>
  | T
  | false
  | null
  | undefined;

export interface TiwiComponentProps<T extends string> {
  variants?: TiwiVariantsProp<T>;
}

export type PropsWithoutVariants<P> = P extends any
  ? "variants" extends keyof P
    ? Omit<P, "variants">
    : P
  : P;

//
// Function.
//

export type TiwiExoticComponent<
  TProps extends object,
  TRef,
  TVariant extends string,
> = ExoticComponent<
  PropsWithoutRef<PropsWithoutVariants<TProps> & TiwiComponentProps<TVariant>> &
    RefAttributes<TRef>
>;

export interface TiwiBuilder<
  TProps extends object,
  TRef,
  TVariant extends string = never,
> {
  <T extends string>(
    classNames: TemplateStringsArray,
    ...variantDefinitions: TiwiVariants<T>[]
  ): TiwiExoticComponent<TProps, TRef, T | TVariant>;
}

export interface TiwiFunction {
  <E extends ElementType<TiwiProps>>(
    Element: E
  ): TiwiBuilder<
    ComponentProps<E>,
    ComponentRef<E>,
    E extends TiwiExoticComponent<any, any, infer T> ? T : string
  >;
}

export type IntrinsicElementsBuilderMap = {
  [K in keyof JSX.IntrinsicElements]: TiwiBuilder<
    JSX.IntrinsicElements[K],
    ElementRef<K>
  >;
};

export interface Tiwi extends TiwiFunction, IntrinsicElementsBuilderMap {}
