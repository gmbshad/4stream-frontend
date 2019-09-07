function rgb2hex(rgb) {
  const matcher = rgb.match(/^rgb\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?\)/i);
  const componentToHex = (component) => {
    const hex = parseInt(component, 10).toString(16);
    return (hex.length === 1) ? '0' + hex : hex;
  };
  if (!matcher || matcher.length !== 4) {
    return '';
  }
  const result = '#' + componentToHex(matcher[1]) + componentToHex(matcher[2]) + componentToHex(matcher[3]);
  return result;
}

function hex2rgb(hex) {
  const matcher = hex.match(/^#([a-f\d]{6})/i);
  if (matcher && matcher.length === 2) {
    const bigint = parseInt(hex.substring(1), 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;

    return `rgb(${[red, green, blue].join()})`;
  }
  return '';
}

export {rgb2hex, hex2rgb};
