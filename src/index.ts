import {jsx} from "react/jsx-runtime";
import {buildTiwi} from "./tiwi.js";

export * from "./types.js";
export const tiwi = buildTiwi(jsx);
export const tw = tiwi;
export default tiwi;
