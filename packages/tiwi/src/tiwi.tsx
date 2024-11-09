import {
  ComponentProps,
  ElementType,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {twMerge} from "tailwind-merge";
import {allIntrinsicElements} from "./elements.js";
import {
  IntrinsicElementsBuilderMap,
  Tiwi,
  TiwiComponentProps,
  TiwiFunction,
  TiwiProps,
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

const tiwiBase: TiwiFunction = <E extends ElementType<TiwiProps>>(
  Element: E
) => {
  return <T extends string>(
    classNames: TemplateStringsArray,
    ...variantDefinitions: TiwiVariants<T>[]
  ) => {
    type Props = ComponentProps<E>;
    type RefType = E extends abstract new (...args: any) => any ? E : never;
    const AnyElement = Element as any;

    const component = forwardRef<
      InstanceType<RefType>,
      Props & TiwiComponentProps<T>
    >((props, ref) => {
      const {className, variants, ...otherProps} = props;

      const requestedVariants = useVariantsMemo((): ReadonlySet<string> => {
        if (!variants) {
          return new Set();
        }

        if (typeof variants === "string") {
          return new Set([variants]);
        }

        if (Array.isArray(variants)) {
          return new Set(variants);
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
      }, [className, requestedVariants]);

      return (
        <AnyElement ref={ref} className={mergedClassName} {...otherProps} />
      );
    });

    if (typeof Element === "string") {
      component.displayName = `tiwi.${Element}`;
    } else {
      component.displayName =
        Element.displayName || Element.name || "tiwi.Component";
    }

    return component;
  };
};

//
// Add intrinsic components to function.
//

const intrinsicElementsFunctions = allIntrinsicElements.reduce(
  <K extends keyof JSX.IntrinsicElements>(
    result: IntrinsicElementsBuilderMap,
    DomElement: K
  ) => {
    result[DomElement] = tiwiBase(DomElement) as any;
    return result;
  },
  {} as IntrinsicElementsBuilderMap
);

export const tiwi: Tiwi = Object.assign(tiwiBase, intrinsicElementsFunctions);
export const tw = tiwi;
export default tiwi;