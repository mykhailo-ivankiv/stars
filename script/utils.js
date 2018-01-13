import { fromEvent } from "most";
import {pairs} from "d3";

export const fromInput = input => {
  switch (input.type) {
    case "checkbox":
      return fromEvent("change", input)
        .map(e => e.target.checked)
        .startWith(input.checked);

    default:
      return fromEvent("input", input)
        .map(e => e.target.value)
        .startWith(input.value);
  }
};

export const circlePairs = arr => {
    const tmp = pairs(arr);
    tmp.push([arr[arr.length - 1], arr[0]]);
    return tmp;
};