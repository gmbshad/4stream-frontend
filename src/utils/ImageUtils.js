function loadImage(imageUrl, loadCallback, errorCallback) {
  const donationImage = new Image();
  donationImage.onload = loadCallback;
  donationImage.onerror = errorCallback;
  donationImage.validate = 'always';
  donationImage.src = imageUrl;
}

export {loadImage};
