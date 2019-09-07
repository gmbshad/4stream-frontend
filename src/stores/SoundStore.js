import alt from '../alt';

import AuthStore from '../stores/AuthStore';
import SoundActions from '../actions/SoundActions';
import {getDonationSpeechUrl, getDonationSoundUrl, getTTSPreviewUrl, getTestVoiceUrl} from '../utils/UrlUtils';
import {getSupportedAudioFormat, canPlayAudio} from '../utils/AudioUtils';

class SoundStore {

  constructor() {
    this.bindActions(SoundActions);
    this.currentSound = null;
    this.isSoundPlaying = false;
  }

  markSoundPlaying(isPlaying) {
    this.setState({
      isSoundPlaying: isPlaying
    });
    SoundActions.soundStateChanged.defer(isPlaying);
  }

  stopCurrentSound() {
    const currentSound = this.currentSound;
    if (currentSound !== null) {
      currentSound.pause();
    }
    this.markSoundPlaying(false);
  }

  scheduleSoundPlaying(url) {
    if (!canPlayAudio()) {
      console.error('Unable to play any audio format!');
      return;
    }
    this.stopCurrentSound();
    const self = this;

    const sound = new Audio(url);
    this.markSoundPlaying(true);
    this.setState({
      currentSound: sound
    });
    sound.autoplay = true;
    sound.addEventListener('error', () => {
      console.error('Unable to load sound, error code: ' + sound.error.code);
      self.markSoundPlaying(false);
    });
    sound.addEventListener('ended', () => {
      self.markSoundPlaying(false);
    });
  }

  onPlayDonationSpeech({donationId}) {
    const token = AuthStore.getState().token;
    const format = getSupportedAudioFormat();
    const url = getDonationSpeechUrl(donationId, format, token);
    this.scheduleSoundPlaying(url);
  }

  onPlayDonationSound() {
    const token = AuthStore.getState().token;
    const format = getSupportedAudioFormat();
    const url = getDonationSoundUrl(format, token);
    this.scheduleSoundPlaying(url);
  }

  onPreviewTTS({text, ttsVoice}) {
    const format = getSupportedAudioFormat();
    const url = getTTSPreviewUrl(text, ttsVoice, format);
    this.scheduleSoundPlaying(url);
  }

  onStopSound() {
    this.stopCurrentSound();
  }

  onPlayVoiceTestSound(voice) {
    const format = getSupportedAudioFormat();
    const url = getTestVoiceUrl(voice, format);
    this.scheduleSoundPlaying(url);
  }
}

export default alt.createStore(SoundStore, 'SoundStore');
