import {
  ComponentProps,
  ComponentRef,
  ElementRef,
  ElementType,
  ExoticComponent,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  PropsWithRef,
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
  | T
  | ReadonlyArray<T>
  | TiwiVariantsMap<T>
  | false
  | null
  | undefined;

export interface TiwiComponentProps<T extends string> {
  variants?: TiwiVariantsProp<T>;
}

//
// Function.
//

export interface TiwiBuilder<P extends object, R> {
  <T extends string>(
    classNames: TemplateStringsArray,
    ...variantDefinitions: TiwiVariants<T>[]
  ): ExoticComponent<
    PropsWithoutRef<P & TiwiComponentProps<T>> & RefAttributes<R>
  >;
}

export interface TiwiFunction {
  <E extends ElementType<TiwiProps>>(
    Element: E
  ): TiwiBuilder<
    ComponentProps<E>,
    InstanceType<E extends abstract new (...args: any) => any ? E : never>
  >;
}

export type IntrinsicElementsBuilderMap = {
  [K in keyof JSX.IntrinsicElements]: TiwiBuilder<
    JSX.IntrinsicElements[K],
    ElementRef<K>
  >;
};

export interface Tiwi extends TiwiFunction, IntrinsicElementsBuilderMap {}
