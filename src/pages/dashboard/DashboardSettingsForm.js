import React from 'react';
import alt from '../../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';

import SettingsStore from '../../stores/SettingsStore';
import SettingsActions from '../../actions/SettingsActions';
import Button from '../../components/Button';
import {localizeString} from '../../localization/LocalizationUtils';
import ModalDialogFont from '../../components/modal/ModalDialogFont';
import ModalDialogActions from '../../actions/ModalDialogActions';
import StyledText from '../../components/StyledText';


class DashboardSettingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.saveSettings = this.saveSettings.bind(this);
    this.setFormValid = this.setFormValid.bind(this);
  }

  componentWillMount() {
    this.setFormValid(true);

    this.actionListener = new ActionListeners(alt);
    this.getActionsToListen().forEach(id => {
      this.actionListener.addActionListener(
          id, () => {
            const storeState = this.getStore().getState();
            this.updateStateFromStore(storeState);
          });
    });
    this.updateStateFromStore(this.getStore().getState());
  }

  componentWillUnmount() {
    this.actionListener.removeAllActionListeners();
  }

  getActionsToListen() {
    // can be overridden in subclass
    return [SettingsActions.receiveSettings.id, SettingsActions.receiveSettingsUpdate.id];
  }

  getStore() {
    // can be overridden in subclass
    return SettingsStore;
  }

  getSaveAction() {
    // can be overridden in subclass
    return SettingsActions.requestSettingsUpdate;
  }

  updateStateFromStore(settingsStoreState) {
    // must be overridden in subclass
    console.warn('updateStateFromStore was not overriden. State: ' + settingsStoreState);
  }

  setFormValid(formValid) {
    this.setState({formValid});
  }

  getSettings() {
    const settings = Object.assign({}, this.state);
    delete settings.formValid;
    return settings;
  }

  saveSettings() {
    this.getSaveAction().defer(this.getSettings());
  }

  openFontDialogFunction(title, fontSettings, saveAction, fieldName) {
    return () => {
      const onSave = (settings) => {
        saveAction({
          [fieldName]: settings
        }
        );
      };
      const modal = <ModalDialogFont title={title} fontSettings={fontSettings} onSave={onSave}/>;
      ModalDialogActions.showModal(modal);
    };
  }

  renderHeader(headerText) {
    return (
        <div className="b-dashboard-settings-form__header">
          <div className="b-dashboard-settings-form-header">
            {headerText}
          </div>
        </div>
    );
  }

  renderSeparator() {
    return (
        <div className="b-dashboard-settings-form__separator"/>
    );
  }

  renderRemark(text, modifier) {
    let remarkClasses = 'b-dashboard-settings-form-remark';
    if (modifier !== undefined) {
      remarkClasses += ` ${modifier}`;
    }
    return (
        <div className="b-dashboard-settings-form__remark">
          <div className={remarkClasses}>
            {text}
          </div>
        </div>
    );
  }

  renderWarning(text) {
    return this.renderRemark(text, 'b-dashboard-settings-form-remark--warning');
  }

  renderImages(fileNames) {
    return (
        <div className="b-dashboard-settings-form__images">
          <div className="b-dashboard-settings-form-images">
            {fileNames.map((fileName) => (
                <div key={fileName} className="b-dashboard-settings-form__image">
                  <img className="b-dashboard-settings-form-image" src={`/resources/images/${fileName}`}/>
                </div>
              ))}
          </div>
        </div>
    );
  }

  renderLinkWithTextPreview(link, fontSettings) {
    const text = localizeString('DASHBOARD_WIDGETS_ALERTS.SAMPLE_TEXT');
    return (
        <div className="b-dashboard-link-with-text-preview">
          <div className="b-dashboard-link-with-text-preview__part">
            {link}
          </div>
          <div className="b-dashboard-link-with-text-preview__part">
            <StyledText text={text} fontSettings={fontSettings}/>
          </div>
        </div>
    );
  }

  renderActionLinkWithIcon(onClick, faClass, anchor) {
    return (
        <div className="b-dashboard-link" onClick={onClick}>
          <div className={`b-dashboard-link__icon fa ${faClass}`}/>
          <div className="b-dashboard-link__anchor">
            {anchor}
          </div>
        </div>
    );
  }

  renderFontSettings(dialogTitle, fontSettings, saveAction, fieldName) {
    const fontSettingsDialog = this.openFontDialogFunction(dialogTitle, fontSettings, saveAction, fieldName);
    const customizeFontAnchor = localizeString('DASHBOARD_WIDGETS_ALERTS.CUSTOMIZE_FONT');
    const titleSettingsLink = this.renderActionLinkWithIcon(fontSettingsDialog, 'fa-cogs', customizeFontAnchor);
    return this.renderLinkWithTextPreview(titleSettingsLink, fontSettings);
  }


  renderSaveButton() {
    const saveButtonText = localizeString('DASHBOARD_SETTINGS.SAVE_BUTTON');
    const saveButton = <Button text={saveButtonText} disabled={!this.state.formValid} onClick={this.saveSettings}/>;

    return (
        <div className="b-dashboard-settings-form__save">
          <div className="b-dashboard-save-settings">
            {saveButton}
          </div>
        </div>
    );
  }
}

DashboardSettingsForm.propTypes = {
};

export default DashboardSettingsForm;

