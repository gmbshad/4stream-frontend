function matchElement(type, contentWrapper) {
  let element = null;
  const regex = new RegExp(`\\[${type}=(.+?)\\]`);
  const match = contentWrapper.content.match(regex);
  if (match !== null && match.length > 1) {
    element = match[1];
    contentWrapper.content = contentWrapper.content.replace(regex, '');
  }
  return element;
}

function matchLink(contentWrapper) {
  return matchElement('link', contentWrapper);
}

function matchImage(contentWrapper) {
  return matchElement('image', contentWrapper);
}

function matchYoutubeVideo(contentWrapper) {
  return matchElement('youtube', contentWrapper);
}

export {matchLink, matchImage, matchYoutubeVideo};

