import {createInteropElement} from "nativewind";
import {buildTiwi} from "./tiwi.js";

export * from "./types.js";
export const tiwi = buildTiwi(createInteropElement);
export const tw = tiwi;
export default tiwi;
