import { fromEvent } from "most";

export const fromInput = input => {
  switch (input.type) {
    case "checkbox":
      return fromEvent("input", input)
        .map(e => e.target.checked)
        .startWith(input.checked);

    default:
      return fromEvent("input", input)
        .map(e => e.target.value)
        .startWith(input.value);
  }
};
