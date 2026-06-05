import {jsx} from "react/jsx-runtime";
import {buildTiwi} from "#/tiwi.ts";

export * from "#/types.ts";
export const tiwi = buildTiwi(jsx);
export const tw = tiwi;
export default tiwi;
