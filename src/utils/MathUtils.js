function parseInteger(value) {
  // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
  if (/^(\-)?([0-9]+)$/.test(value)) {
    return Number(value);
  }
  return Number.NaN;
}

function clamp(value, min, max) {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
}

export {parseInteger, clamp};
