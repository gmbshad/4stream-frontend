const AUDIO_TEST = document.createElement('audio');

function canPlayMP3() {
  return !!(AUDIO_TEST.canPlayType && AUDIO_TEST.canPlayType('audio/mpeg;').replace(/no/, ''));
}

function canPlayOGG() {
  return !!(AUDIO_TEST.canPlayType && AUDIO_TEST.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
}

function getSupportedAudioFormat() {
  // order matters. chromium overestimates itself claiming it supports MP3
  if (canPlayOGG()) {
    return 'ogg';
  }
  if (canPlayMP3()) {
    return 'mp3';
  }
  return null;
}

function getSupportedAudioMimeType() {
  const audioFormat = getSupportedAudioFormat();
  if (audioFormat === 'ogg') {
    return 'audio/ogg';
  } else if (audioFormat === 'mp3') {
    return 'audio/mpeg';
  }
  return null;
}

function canPlayAudio() {
  return getSupportedAudioFormat() !== null;
}

export {getSupportedAudioFormat, canPlayAudio, getSupportedAudioMimeType};
