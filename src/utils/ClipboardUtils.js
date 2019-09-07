// http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
// Note: HTML element must be focused and selected before calling this function(it can be hidden)
/* Example:
  const donationWidgetUrl = this.refs.donationWidgetUrl;
  donationWidgetUrl.focus();
  donationWidgetUrl.setSelectionRange(0, donationWidgetUrl.value.length);
  copyToClipboard();
 */
function copyToClipboard() {
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.log('Error while copying to clipboard: ' + err);
  }
  return success;
}

export {copyToClipboard};
