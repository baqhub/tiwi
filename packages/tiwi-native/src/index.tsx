import {ComponentProps, ComponentType, forwardRef, useMemo} from "react";
import {twMerge} from "tailwind-merge";

//
// Constants.
//

const defaultVariant = "default_variant";

//
// Types.
//

interface TWProps {
  className?: string;
}

type TWVariantsMap<T extends string> = {
  [K in T | typeof defaultVariant]?: boolean;
};

interface TWComponentProps<T extends string> {
  variants?: T | TWVariantsMap<T> | false | null;
}

type TWVariants<T extends string> = {
  [K in T]?: string;
};

//
// Function.
//

function normalize(classNames: ReadonlyArray<string | undefined>) {
  return twMerge(...classNames);
}

export function tiwi<C extends ComponentType<TWProps>>(Component: C) {
  return <T extends string>(
    classNames: TemplateStringsArray,
    ...args: TWVariants<T>[]
  ) => {
    type Props = ComponentProps<C>;
    type RefType = C extends abstract new (...args: any) => any ? C : never;

    return forwardRef<InstanceType<RefType>, Props & TWComponentProps<T>>(
      (props, ref) => {
        const {className, variants, ...otherProps} = props;

        const requestedVariants = useDeepMemo<ReadonlySet<string>>(() => {
          if (!variants) {
            return new Set();
          }

          if (!isString(variants)) {
            return new Set(
              Object.keys(variants)
                .map(k => k as T)
                .filter(k => variants[k] === true)
            );
          }

          return new Set([variants]);
        }, [variants]);

        const mergedClassName = useMemo(() => {
          const allClassNames = classNames.reduce((list, current, index) => {
            const variantValues = args[index - 1];

            if (variantValues) {
              Object.keys(variantValues)
                .filter(v => requestedVariants.has(v))
                .forEach(v => {
                  const variantValue = variantValues[v as T];
                  if (!variantValue) {
                    return;
                  }

                  list.push(variantValue);
                });
            }

            list.push(current);
            return list;
          }, [] as string[]);

          return normalize([...allClassNames, className]);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [classNames, args, className, requestedVariants]);

        const AnyComponent = Component as any;
        return (
          <AnyComponent {...otherProps} ref={ref} className={mergedClassName} />
        );
      }
    );
  };
}

export const tw = tiwi;
export default tiwi;
