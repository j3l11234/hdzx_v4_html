const PREFIX = "_form_";

class FormValidator {

  constructor(data) {
    this.validators = {};
    this.state = {};
    for(var name in data){
      this.validators[name] = data[name].validator;
      this.state[PREFIX + name + '_value'] = data[name].value;
      this.state[PREFIX + name + '_error'] = null;
    }
  }

  setInput(name, input) {
    this.validators[name] = input.validator;
    this.state[PREFIX + name + '_value'] = input.value;
    this.state[PREFIX + name + '_error'] = null;
  }

  handleChange(name, event) {
    let value = '';
    switch (event.target.type) {
      case 'checkbox' :
        value = event.target.checked;
        break;
      case 'text' :
        value = event.target.value;
        break;
      default :
        value = event.target.value;
        break;
    }

    let error = this.validators[name](value);
    this.state[PREFIX + name + '_value'] = value;
    this.state[PREFIX + name + '_error'] = error;
  }

  getInputError(name) {
    return this.state[PREFIX + name + '_error'];
  }

  getInputValue(name) {
    return this.state[PREFIX + name + '_value'];
  }

  setInputValue(name, value) {
    this.state[PREFIX + name + '_value'] = value;
    this.state[PREFIX + name + '_error'] = null;
  }

  validateAll() {
    let hasError = false;
    for(var name in this.validators){
      let value = this.state[PREFIX + name + '_value'];
      let error = this.validators[name](value);
      this.state[PREFIX + name + '_error'] = error;
    }
  }

  getState() {
    return this.state;    
  }

  getFirstError() {
    for(var name in this.validators){
      let error = this.state[PREFIX + name + '_error'];
      if (error) {
        return error;
      }
    }
  }

  getFormData () {
    let data = {}
    for(var name in this.validators){
      data[name] = this.state[PREFIX + name + '_value'];
    }
    return data;
  }
}

export default FormValidator;