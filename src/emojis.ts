const YES_EMOJI = "✅";
const NO_EMOJI = "❌";

const countStringsInArray = (string: string, array: string[]) =>
  array.reduce((previousValue, currentValue) => {
    if (currentValue === string) return previousValue + 1;
    return previousValue;
  }, 0);

export { YES_EMOJI, NO_EMOJI, countStringsInArray };
