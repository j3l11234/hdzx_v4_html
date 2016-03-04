const PREFIX = "_form_";

class FormValidator {
  constructor (component, data) {
    this.component = component;

    this.validators = {};
    let initState = {};
    for(var name in data){
      this.validators[name] = data[name].validator;
      initState[PREFIX + name + '_value'] = data[name].value;
      initState[PREFIX + name + '_error'] = null;
    }
    this.component.state = Object.assign(this.component.state, initState);
    this.errorText = '';
  }

  handleChange (name, event){
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

    this.validateValue(name, value);
  }

  validateValue (name, value) {
    let error = this.validators[name](value);

    let result = {};
    result[PREFIX + name + '_value'] = value;
    result[PREFIX + name + '_error'] = error;
    this.component.setState(result);
    return error;
  }

  getInputError (name) {
    return this.component.state[PREFIX + name + '_error'];
  }

  getInputValue (name) {
    return this.component.state[PREFIX + name + '_value'];
  }

  validateAll (){
    let hasError = false;
    for(var name in this.validators){
      let value = this.getInputValue(name);
      let error = this.validateValue(name, value);
      if (error && !hasError) {
        hasError = true;
        this.errorText = error;
      }
    }
    return !hasError;
  }

  getFormData () {
    let data = {}
    for(var name in this.validators){
      data[name] = this.getInputValue(name);
    }
    return data;
  }
}

export default FormValidator;