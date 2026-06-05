import {jsx} from "react/jsx-runtime";
import {buildTiwiBase} from "#/tiwi.ts";

export * from "#/types.ts";
export const tiwi = buildTiwiBase(jsx);
export const tw = tiwi;
export default tiwi;
