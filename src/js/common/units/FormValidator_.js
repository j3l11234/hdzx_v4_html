//const PREFIX = "_form_";

function _setValue(name, value) {
  this._setState({[this.PREFIX + name + '_value']: value});
}

function _setError(name, error) {
  this._setState({[this.PREFIX + name + '_error']: error});
}

function _getValue(name) {
  return this._getState()[this.PREFIX + name + '_value'];
}

function _getError(name) {
  return this._getState()[this.PREFIX + name + '_error'];
}

class FormValidator {
  constructor(getStateCallback, setStateCallback, prefix) {
    this.PREFIX = prefix ? prefix : '_form_';
    this._getState = getStateCallback;
    this._setState = setStateCallback;
    this._setValue = _setValue;
    this._getValue = _getValue;
    this._setError = _setError;
    this._getError = _getError;
    this.active = [];
    this.validators = {};
  }

  setInputs(inputs) {
    for (var name in inputs) {
      let input = inputs[name];
      if (typeof input === 'function') {
        this.validators[name] = input;
        this._setValue(name, '');
        this._setError(name, null);
      } else if(typeof input === 'object') {
        this.validators[name] = input.validator;
        this._setValue(name, input.value);
        this._setError(name, null);
      }
    }
  }

  setInput(name, input) {
    this.setInputs({[name]: input});
  }

  setActive(names) {
    this.active = names;
  }

  setInputValue(name, value, validate) {
    this._setValue(name, value);
    if (validate === true) {
      this._setError(name, this.validators[name](value));
    }
  }

  setInputValues(values, validate) {
    for (var name in values) {
      this.setInputValue(name, values[name], validate)
    }
  }

  getInputValue(name, defaultValue) {
    let value = this._getValue(name);
    if (!value) {
      value = defaultValue ? defaultValue : '';
    }
    return value;
  }

  getInputValues(names) {
    let values = {};
    for (var i in names) {
      let name = names[i];
      values[name] = this._getValue(name);
    }
    return values;
  }

  getInputError(name) {
    return this._getError(name);
  }

  handleChange(name, event) {
    let value = '';
    let type = event.target.type;
    if (type === 'input' || type === 'textarea') {
      value = event.target.value;
    } else if (type === 'checkbox' || type === 'radio') {
      value = event.target.checked;
    } else if (type === 'option') {
      value = event.target.selected;
    } else {
      value = event.target.value;
    }

    this.setInputValue(name, value, true);
  }

  validateInputs(names) {
    let errors = [];
    for (var i = 0; i < names.length; i++) {
      let name = names[i];
      let value = this._getValue(name);
      let validateFn = this.validators[name];
      let error = (typeof validateFn === 'function') ? validateFn(value) : null;
      this._setError(name, error);
      if (error) {
        errors.push({
          name: name,
          error: error,
        });
      }
    }
    return errors;
  }
}

export default FormValidator;