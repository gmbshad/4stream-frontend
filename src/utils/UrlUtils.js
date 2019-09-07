import Constants from './Constants';

function cacheBreaker() {
  return `cacheBreaker=${Date.now()}`;
}

function getDonationSpeechUrl(donationId, format, token) {
  return `${Constants.AUDIO_API_URL_DONATION_SPEECH}${donationId}.${format}?token=${token}&${cacheBreaker()}`;
}

function getDonationSoundUrl(format, token) {
  return `${Constants.MEDIA_API_URL_DONATION_SOUND}.${format}?token=${token}&${cacheBreaker()}`;
}

// (!) If audio format is not used in url path some browsers(latest Safari, maybe IE11) work incorrectly
function getTTSPreviewUrl(text, ttsVoice, format) {
  return `${Constants.AUDIO_API_URL_TTS_PREVIEW}.${format}`
      + `?message=${encodeURIComponent(text)}&voice=${ttsVoice}&${cacheBreaker()}`;
}

function getTestVoiceUrl(ttsVoice, format) {
  return `${Constants.AUDIO_API_URL_TEST_VOICE}.${format}`
      + `?voice=${ttsVoice}&${cacheBreaker()}`;
}

function getPersonalPageUrl({userName, full}) {
  const url = !full ? Constants.DONATION_PAGE_URL : Constants.DONATION_PAGE_URL_FULL;
  return `${url}/${userName}`;
}

function getDonationWidgetUrl({token, testMode, full}) {
  let url = !full ? `${Constants.DONATION_WIDGET_URL}` : `${Constants.DONATION_WIDGET_URL_FULL}`;
  url += `?token=${token}`;
  if (testMode) {
    url += '&testMode';
  }
  return url;
}

function getDonationGoalUrl({token}) {
  return `${Constants.DONATION_GOAL_URL_FULL}?token=${token}`;
}

// fileName parameter is used as cache breaker when defined
function getDonationImageUrl(token) {
  return `${Constants.MEDIA_API_URL_DONATION_IMAGE}?token=${token}&cacheBreaker=${Date.now()}`;
}

export {getDonationSpeechUrl, getDonationSoundUrl, getTTSPreviewUrl, getDonationImageUrl, getPersonalPageUrl,
    getDonationWidgetUrl, getDonationGoalUrl, getTestVoiceUrl};
