import alt from '../alt';

class SoundActions {
  playDonationSpeech({donationId}) {
    return {donationId};
  }

  playDonationSound() {
    return true;
  }
  
  stopSound() {
    return true;
  }

  previewTTS({text, ttsVoice}) {
    return {text, ttsVoice};
  }

  soundStateChanged(isSoundPlaying) {
    return isSoundPlaying;
  }

  playVoiceTestSound(voice) {
    return voice;
  }
}

export default alt.createActions(SoundActions);
