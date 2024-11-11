import {
  ComponentProps,
  ComponentRef,
  ElementType,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {twMerge} from "tailwind-merge";
import {allIntrinsicElements} from "./elements.js";
import {
  ElementWithTiwiProps,
  IntrinsicElementsBuilderMap,
  PropsWithoutVariants,
  Tiwi,
  TiwiComponentProps,
  TiwiExoticComponent,
  TiwiFunction,
  TiwiVariants,
  TiwiVariantsProp,
} from "./types.js";

//
// Variants helpers.
//

function areVariantsEqual<T extends string>(
  variants1: TiwiVariantsProp<T>,
  variants2: TiwiVariantsProp<T>
) {
  // False / Null / Undefined.
  if (!variants1) {
    return !variants2;
  }

  // String.
  if (typeof variants1 === "string") {
    return variants1 === variants2;
  }

  // Array.
  if (Array.isArray(variants1)) {
    return (
      Array.isArray(variants2) &&
      variants1.length === variants2.length &&
      variants1.every((v, i) => variants2[i] === v)
    );
  }

  // Map.
  const keys1 = Object.keys(variants1);
  const keys2 = variants2 ? Object.keys(variants2) : [];

  return (
    keys1.length === keys2.length &&
    keys1.every(k => (variants2 as any)[k] === (variants1 as any)[k as T])
  );
}

function useVariantsMemo<TValue, T extends string>(
  memoFn: () => TValue,
  variants: TiwiVariantsProp<T>
): TValue {
  const value = useRef<{variants: TiwiVariantsProp<T>; value: TValue}>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const result =
    value.current && areVariantsEqual(value.current.variants, variants)
      ? value.current
      : {variants, value: memoFn()};

  useEffect(() => {
    value.current = result;
  }, [result]);

  return result.value;
}

//
// Component factory.
//

const tiwiComponentSymbol = Symbol("TiwiComponent");

function isTiwiComponent(
  Element: ElementType<any>
): Element is TiwiExoticComponent<any, any, any> {
  return Element && (Element as any)[tiwiComponentSymbol] === true;
}

function isString(source: any): source is string {
  return typeof source === "string";
}

const tiwiBase: TiwiFunction = <E extends ElementType>(
  Element: ElementWithTiwiProps<E>
) => {
  type TVariant = E extends TiwiExoticComponent<any, any, infer T> ? T : never;

  return <T extends string = never>(
    classNames: TemplateStringsArray,
    ...variantDefinitions: TiwiVariants<T>[]
  ) => {
    type Props = PropsWithoutVariants<ComponentProps<E>>;
    type Ref = ComponentRef<E>;
    const AnyElement = Element as any;
    const isTiwi = isTiwiComponent(Element);

    const component = forwardRef<Ref, Props & TiwiComponentProps<T | TVariant>>(
      (props, ref) => {
        const {className, variants, ...otherProps} = props;

        const requestedVariants = useVariantsMemo((): ReadonlySet<string> => {
          if (!variants) {
            return new Set();
          }

          if (typeof variants === "string") {
            return new Set([variants]);
          }

          if (Array.isArray(variants)) {
            return new Set(variants.filter(isString));
          }

          return new Set(
            Object.keys(variants).filter(k => (variants as any)[k] === true)
          );
        }, variants);

        const mergedClassName = useMemo(() => {
          const allClassNames = classNames.reduce((list, current, index) => {
            const variantDefinition = variantDefinitions[index - 1];

            if (variantDefinition) {
              Object.keys(variantDefinition)
                .filter(v => requestedVariants.has(v))
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
        }, [classNames, variantDefinitions, className, requestedVariants]);

        if (isTiwi) {
          return (
            <AnyElement
              {...otherProps}
              ref={ref}
              className={mergedClassName}
              variants={variants}
            />
          );
        }

        return (
          <AnyElement {...otherProps} ref={ref} className={mergedClassName} />
        );
      }
    );

    if (typeof Element === "string") {
      component.displayName = `tiwi.${Element}`;
    } else {
      const name = Element.displayName || Element.name || "";
      component.displayName = `tiwi(${name})`;
    }

    (component as any)[tiwiComponentSymbol] = true;
    return component;
  };
};

//
// Add intrinsic components to function.
//

function buildTiwi(): Tiwi {
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

export const tiwi = buildTiwi();
