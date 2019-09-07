export default class Validator {
  constructor(callback, inputs) {
    this.inputs = inputs;
    this.callback = callback;
    this.validate = this.validate.bind(this);
  }

  validate() {
    const formValid = this.inputs.reduce((previous, current) => previous && current.isValid(), true);
    this.callback(formValid);
    return formValid;
  }
}
