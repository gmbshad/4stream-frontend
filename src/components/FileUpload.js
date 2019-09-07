import React from 'react';
import alt from '../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import classNames from 'classnames';
import {sprintf} from 'sprintf-js';

import SoundActions from '../actions/SoundActions';
import SoundStore from '../stores/SoundStore';
import AuthStore from '../stores/AuthStore';
import Input from '../components/Input';
import {getMockValidation} from '../utils/Validations';
import {getDonationImageUrl} from '../utils/UrlUtils';
import {loadImage} from '../utils/ImageUtils';
import {localizeString} from '../localization/LocalizationUtils';
import Constants from '../utils/Constants';

const SUPPORTED_IMAGE_FORMATS = new Set();
SUPPORTED_IMAGE_FORMATS.add('image/png');
SUPPORTED_IMAGE_FORMATS.add('image/jpg');
SUPPORTED_IMAGE_FORMATS.add('image/jpeg');
SUPPORTED_IMAGE_FORMATS.add('image/gif');

const NO_NEW_FILE_LABEL = localizeString('FILE_UPLOAD.NO_FILE_CHOSEN');
const NO_OLD_FILE_LABEL = localizeString('FILE_UPLOAD.DEFAULT_FILE');

const INTERNAL_INPUT_REF = 'internalInput';
const MAX_FILE_SIZE = Constants.MAX_UPLOAD_SIZE_MB * 1024 * 1024;
const FILE_NAME_MAX_LENGTH = 50;
const HUGE_FILE_ERROR_MESSAGE = sprintf(localizeString('FILE_UPLOAD.HUGE_FILE'), Constants.MAX_UPLOAD_SIZE_MB);
const FILE_NAME_TOO_LONG = localizeString('FILE_UPLOAD.FILE_NAME_TOO_LONG');
const UNSUPPORTED_IMAGE_FORMAT = localizeString('FILE_UPLOAD.UNSUPPORTED_IMAGE');
const UNSUPPORTED_AUDIO_FORMAT = localizeString('FILE_UPLOAD.UNSUPPORTED_AUDIO');

export default class FileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.saveFile = this.saveFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.openFileSelectDialog = this.openFileSelectDialog.bind(this);
    this.onFileChanged = this.onFileChanged.bind(this);
  }
  
  componentWillMount() {
    this.resetFileInput();
    this.setFileOperationInProgress(false);
    this.actionListener = new ActionListeners(alt);
  }

  componentWillUnmount() {
    this.actionListener.removeAllActionListeners();
  }

  // override in subclass
  getFormFieldName() {
    console.error('getFormFieldName() must be overriden in subclass');
    return null;
  }

  // override in subclass
  validateUploadedFile(file) {
    console.error('validateUploadedFile() must be overriden in subclass ' + file);
    return null;
  }

  // override in subclass
  getAcceptAttribute() {
    console.error('getAcceptAttribute() must be overriden in subclass');
    return null;
  }

  resetFileInput() {
    // changing "key" on react element makes it to reset(reset uploaded file)
    this.setState({
      uploadedFileHash: Math.random(),
      newFileLabel: NO_NEW_FILE_LABEL,
      newFileErrorMessage: null
    });
  }
  
  setFileOperationInProgress(isFileOperationInProgress) {
    this.setState({isFileOperationInProgress});
  }

  getFileInput() {
    return this.refs[INTERNAL_INPUT_REF];
  }
  
  deleteFile() {
    this.props.onDelete();
  }

  saveFile() {
    const files = this.getFileInput().files;
    if (files.length !== 0) {
      const file = files[0];
      const fileReader = new FileReader();
      this.setFileOperationInProgress(true);
      fileReader.onload = () => {
        const formData = new FormData();
        formData.append(this.getFormFieldName(), file);
        this.props.onSave(formData, file.name);
      };
      fileReader.onerror = () => {
        console.error('File upload error');
        this.setFileOperationInProgress(false);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  onFileChanged() {
    const fileInput = this.getFileInput();
    const file = (fileInput.files.length > 0) ? fileInput.files[0] : null;
    const fileUploaded = file !== null;
    const newFileLabel = (fileUploaded) ? file.name : NO_NEW_FILE_LABEL;
    let newFileErrorMessage = null;
    if (fileUploaded) {
      if (file.size > MAX_FILE_SIZE) {
        newFileErrorMessage = HUGE_FILE_ERROR_MESSAGE;
      } else if (file.name.length > FILE_NAME_MAX_LENGTH) {
        newFileErrorMessage = FILE_NAME_TOO_LONG;
      } else {
        newFileErrorMessage = this.validateUploadedFile(file);
      }
    }
    this.setState({
      newFileLabel,
      newFileErrorMessage
    });
    const canUpload = (newFileLabel !== NO_NEW_FILE_LABEL && newFileErrorMessage === null);
    if (canUpload) {
      this.saveFile();
    }
  }
  
  openFileSelectDialog() {
    this.getFileInput().click();
  }

  currentMediaOverridden() {
    return (this.props.currentUploadedFileName !== null);
  }

  renderNewFileErrorMessage() {
    const {newFileErrorMessage} = this.state;
    if (newFileErrorMessage === null) {
      return null;
    }
    return (
      <div className="b-file-upload-part__error">
        <div className="b-file-upload-part-error">
          {newFileErrorMessage}
        </div>
      </div>
    );
  }

  // may be overriden
  renderCurrentFileAdditionalControls() {
    return [];
  }

  // override in subclass
  renderCurrentFilePreviewAndControls() {
    console.error('renderCurrentFilePreviewAndControls() must be overriden');
    return null;
  }

  renderCurrentFileControls() {
    const deleteElementClasses = classNames({
      'b-file-upload-controls__item': true,
      'b-file-upload-controls__item--hidden': !this.currentMediaOverridden()
    });
    const deleteControl = (
        <div className={deleteElementClasses}>
          <div className="b-file-upload-control b-file-upload-control--red fa fa-times fa-lg"
               onClick={this.deleteFile}></div>
        </div>
    );
    return (
      <div className="b-file-upload-controls">
        {this.renderCurrentFileAdditionalControls()}
        {deleteControl}
      </div>
    );
  }

  render() {
    const {currentUploadedFileName} = this.props;
    const {uploadedFileHash, newFileLabel, isFileOperationInProgress} = this.state;
    const oldFileLabel = this.currentMediaOverridden() ? currentUploadedFileName : NO_OLD_FILE_LABEL;
    const onFileInputClick = !isFileOperationInProgress ? this.openFileSelectDialog : () => {};
    return (
        <div className="b-file-upload">
          <div className="b-file-upload__current">
            <div className="b-file-upload-part">
              <div className="b-file-upload-part__label">
                <div className="b-file-upload-part-label">
                  {localizeString('FILE_UPLOAD.CURRENT_FILE_LABEL')}
                </div>
              </div>
              <div className="b-file-upload-part-input">
                <Input value={oldFileLabel} readOnly smallFont narrow validation={getMockValidation()}/>
              </div>
              {this.renderCurrentFilePreviewAndControls()}
            </div>
          </div>
          <div className="b-file-upload__new">
            <div className="b-file-upload-part">
              <div className="b-file-upload-input-with-label">
                <div className="b-file-upload-input-with-label__label">
                  <div className="b-file-upload-part-label">
                    {localizeString('FILE_UPLOAD.NEW_FILE_LABEL')}
                  </div>
                </div>
                <input className="b-file-upload-internal-input" type="file" key={uploadedFileHash} ref={INTERNAL_INPUT_REF}
                       accept={this.getAcceptAttribute()} onChange={this.onFileChanged}/>
                <div className="b-file-upload-part-input b-file-upload-part-input--active">
                  <Input value={newFileLabel} onClick={onFileInputClick} readOnly smallFont narrow
                         cursorPointer={!isFileOperationInProgress} borderless permanentBackground
                         validation={getMockValidation()}/>
                </div>
              </div>
              {this.renderNewFileErrorMessage()}
            </div>
          </div>
        </div>
    );
  }
}

FileUpload.propTypes = {
  currentUploadedFileName: React.PropTypes.string,
  onSave: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired
};

class SoundUpload extends FileUpload {

  constructor(props) {
    super(props);

    this.playFile = this.playFile.bind(this);
    this.stopFile = this.stopFile.bind(this);
  }

  componentWillMount() {
    super.componentWillMount();

    this.setState({
      isSoundPlaying: SoundStore.getState().isSoundPlaying
    });
    this.actionListener.addActionListener(
        SoundActions.soundStateChanged.id, (isPlaying) => {
          this.setState({
            isSoundPlaying: isPlaying
          });
        });
  }

  getFormFieldName() {
    return 'sound';
  }

  validateUploadedFile(file) {
    if (!file.type.startsWith('audio/')) {
      return UNSUPPORTED_AUDIO_FORMAT;
    }
    return null;
  }

  getAcceptAttribute() {
    return 'audio/*';
  }

  playFile() {
    this.props.onPlay();
  }

  stopFile() {
    this.props.onStop();
  }

  renderCurrentFileAdditionalControls() {
    const isSoundPlaying = this.state.isSoundPlaying;
    const onClick = (!isSoundPlaying) ? this.playFile : this.stopFile;
    const controlClass = (!isSoundPlaying) ? 'fa-play' : 'fa-square';
    return [
      <div key="playback" className="b-file-upload-controls__item">
        <div className={`b-file-upload-control b-file-upload-control--green fa fa-lg ${controlClass}`}
             onClick={onClick}></div>
      </div>
    ];
  }

  renderCurrentFilePreviewAndControls() {
    return (
        <div className="b-file-upload-part__controls">
          {this.renderCurrentFileControls()}
        </div>
    );
  }
}

SoundUpload.propTypes = Object.assign({}, FileUpload.propTypes, {
  onPlay: React.PropTypes.func,
  onStop: React.PropTypes.func
});

class ImageUpload extends FileUpload {

  componentWillMount() {
    super.componentWillMount();

    this.loadImagePreview();
  }

  getFormFieldName() {
    return 'image';
  }

  validateUploadedFile(file) {
    if (!SUPPORTED_IMAGE_FORMATS.has(file.type)) {
      return UNSUPPORTED_IMAGE_FORMAT;
    }
    return null;
  }

  getAcceptAttribute() {
    return 'image/*';
  }

  loadImagePreview() {
    const token = AuthStore.getState().token;
    const imageUrl = getDonationImageUrl(token);
    this.setState({
      backgroundImage: 'none',
      imageLoading: true
    });
    const loadCallback = () => {
      this.setState({imageLoading: false, backgroundImage: `url(${imageUrl})`});
    };
    const errorCallback = () => {
      console.error('image loading error');
      this.setState({imageLoading: false, backgroundImage: 'none'});
    };
    loadImage(imageUrl, loadCallback, errorCallback);
  }

  renderCurrentImagePreview() {
    const loadingSpinner = (!this.state.imageLoading) ? null : (
        <div className="fa fa-spinner fa-pulse fa-2x"></div>
    );
    const imagePreviewStyle = {
      backgroundImage: this.state.backgroundImage
    };

    return (
        <div className="b-file-upload-part__preview">
          <div className="b-file-upload-part-preview">
            <div className="b-file-upload-part-preview__bounding-box" style={imagePreviewStyle}>
              {loadingSpinner}
            </div>
          </div>
        </div>
    );
  }

  renderCurrentFilePreviewAndControls() {
    return (
        <div className="b-file-upload-part__image-preview-with-controls">
          <div className="b-file-upload-image-preview-with-controls">
            {this.renderCurrentImagePreview()}
            {this.renderCurrentFileControls()}
          </div>
        </div>
    );
  }
}

export {SoundUpload, ImageUpload};
