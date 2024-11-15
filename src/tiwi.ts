import {
  ComponentProps,
  ComponentRef,
  ComponentType,
  ElementType,
  forwardRef,
  ReactNode,
  useMemo,
} from "react";
import {twMerge} from "tailwind-merge";
import {allIntrinsicElements} from "./elements.js";
import {
  ElementWithTiwiProps,
  IntrinsicElementsBuilderMap,
  PropsWithoutVariants,
  Tiwi,
  TiwiComponentProps,
  tiwiComponentSymbol,
  TiwiExoticComponent,
  TiwiFunction,
  TiwiProps,
  TiwiVariants,
  TiwiVariantsProp,
} from "./types.js";

//
// Variants helpers.
//

function variantsToArray<T extends string>(variants: TiwiVariantsProp<T>) {
  if (!variants) {
    return [];
  }

  if (typeof variants === "string") {
    return [variants];
  }

  if (Array.isArray(variants)) {
    return variants.filter(isString);
  }

  return Object.keys(variants).filter(k => (variants as any)[k] === true);
}

//
// Component factory.
//

function isTiwiComponent(
  Element: ElementType<any>
): Element is TiwiExoticComponent<any, any, any> {
  return Element && (Element as any)[tiwiComponentSymbol] === true;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

interface IntermediateProps<T extends string> extends TiwiProps {
  variants?: TiwiVariantsProp<T>;
}

type JSXFunction = (
  type: ComponentType,
  props: Record<string, any> | undefined | null
) => ReactNode;

function buildTiwiBase(createElement: JSXFunction): TiwiFunction {
  return <E extends ElementType>(Element: ElementWithTiwiProps<E>) => {
    type TVariant =
      E extends TiwiExoticComponent<any, any, infer T> ? T : never;

    return <T extends string = never>(
      classNames: TemplateStringsArray,
      ...variantDefinitions: TiwiVariants<T>[]
    ) => {
      type Props = PropsWithoutVariants<ComponentProps<E>>;
      type Ref = ComponentRef<E>;
      const AnyElement = Element as any;
      const isTiwi = isTiwiComponent(Element);

      const component = forwardRef<
        Ref,
        Props & TiwiComponentProps<T | TVariant>
      >((props, ref) => {
        const {className, variants, ...otherProps} =
          props as IntermediateProps<T>;

        const flatVariants = variantsToArray(variants);
        const flatVariantsString = flatVariants.join("::");

        const mergedClassName = useMemo(() => {
          const allClassNames = classNames.reduce((list, current, index) => {
            const variantDefinition = variantDefinitions[index - 1];

            if (variantDefinition) {
              Object.keys(variantDefinition)
                .filter(v => flatVariants.includes(v))
                .forEach(v => {
                  const variantValue = variantDefinition[v as T];
                  if (!variantValue) {
                    return;
                  }

                  list.push(variantValue);
                });
            }

            list.push(current);
            return list;
          }, [] as string[]);

          return twMerge([...allClassNames, className]) || undefined;

          // Refresh on parent variables to make fast-refresh work in RN.
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [classNames, variantDefinitions, className, flatVariantsString]);

        if (isTiwi) {
          return createElement(AnyElement, {
            ...otherProps,
            ref: ref,
            className: mergedClassName,
            variants: variants,
          });
        }

        return createElement(AnyElement, {
          ...otherProps,
          ref: ref,
          className: mergedClassName,
        });
      }) as TiwiExoticComponent<ComponentProps<E>, Ref, T | TVariant>;

      component[tiwiComponentSymbol] = true;
      component.displayName = (() => {
        if (typeof Element === "string") {
          return (component.displayName = `tiwi.${Element}`);
        }

        const name = Element.displayName || Element.name || "";
        return (component.displayName = `tiwi(${name})`);
      })();

      return component;
    };
  };
}

//
// Add intrinsic components to function.
//

export function buildTiwi(createElement: JSXFunction): Tiwi {
  const tiwiBase = buildTiwiBase(createElement);

  if (typeof navigator === "object" && navigator.product === "ReactNative") {
    return tiwiBase as Tiwi;
  }

  const intrinsicElementsFunctions = allIntrinsicElements.reduce(
    <K extends keyof JSX.IntrinsicElements>(
      result: IntrinsicElementsBuilderMap,
      DomElement: K
    ) => {
      result[DomElement] = (tiwiBase as any)(DomElement);
      return result;
    },
    {} as IntrinsicElementsBuilderMap
  );

  return Object.assign(tiwiBase, intrinsicElementsFunctions);
}
