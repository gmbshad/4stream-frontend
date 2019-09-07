/**
 * WebMoney has incorrect handling of "=" in user parameters(it doesn't URL-encode it)
 * that's why we need to remove them
 */
function removeEqualSign(string) {
  return string.replace(/=+/g, '');
}

export {removeEqualSign};
