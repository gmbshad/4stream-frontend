function getHeightAndSteps(height, steps, scaleFactor) {
  return ({
    height: height * Math.pow(10, scaleFactor - 1), steps: steps
  });
}

const PRECALCULATED_DATA_LIMIT = 9;
const LOWER_BOUND = 100.0 / 85.0;

const EPS = 0.01;

function getPrecalculatedHeightAndSteps(maxHeight) {
  if (maxHeight <= 6) {
    return getHeightAndSteps(maxHeight + 1, maxHeight + 1, 1);
  } else if (maxHeight <= 8) {
    return getHeightAndSteps(10, 10, 1);
  } else if (maxHeight <= 9) {
    return getHeightAndSteps(12, 6, 1);
  }
  return null;
}

/**
 * This function is pure heuristic. It calculates number of steps for bar diagram as well as max label value(height)
 * @param maxHeight max value in the array of data to be rendered as chart
 */
function calculateHeightAndSteps(maxHeight) {
  if (maxHeight < 0) {
    throw Error('Max height must be positive: ' + maxHeight);
  }
  if (maxHeight <= PRECALCULATED_DATA_LIMIT) {
    return getPrecalculatedHeightAndSteps(maxHeight);
  }
  const numberOfDigits = maxHeight.toString().length; // javascript way xD
  const scaleFactor = numberOfDigits - 1;
  const scaledHeight = maxHeight / (1.0 * Math.pow(10, scaleFactor - 1));

  const lowerBound = (scaledHeight * LOWER_BOUND) - EPS;

  const steps = 5;
  let height = Math.trunc(lowerBound) + 1;
  while (height % steps !== 0) {
    height++;
  }

  return getHeightAndSteps(height, steps, scaleFactor);
}

export {calculateHeightAndSteps};
