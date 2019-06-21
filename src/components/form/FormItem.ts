import Yox from 'yox'

import template from './template/FormItem.hbs'

import {
  findComponentUpward,
} from '../util'

import {
  RAW_STRING,
  RAW_NUMERIC,
  RAW_BOOLEAN,
} from '../constant'

export default Yox.create({
  propTypes: {
    prop: {
      type: RAW_STRING
    },
    label: {
      type: RAW_STRING
    },
    labelWidth: {
      type: RAW_NUMERIC
    },
    labelFor: {
      type: RAW_STRING
    },
    required: {
      type: RAW_BOOLEAN
    },
    showMessage: {
      type: RAW_BOOLEAN
    },
    error: {
      type: RAW_STRING
    },
    className: {
      type: RAW_STRING
    },
    style: {
      type: RAW_STRING
    }
  },
  template,

  data() {
    return {
      rules: [],
      messages: [],
      defaultValue: '',
      errorMsg: '',
      isShowError: this.get('showMessage'),

      width: this.get('labelWidth')
    }
  },

  events: {
    'validateError.form': function (_, data) {
      let error = data.errors[ this.get('prop') ]
      this.set('errorMsg', error)
    }
  },

  afterMount() {
    let form = findComponentUpward(this, '${prefix}form')
    let prop = this.get('prop')
    let rules = form.get('rules')
    if (rules && prop) {
      rules = form.get('rules')[ prop ]
    }
    let messages = form.get('messages')
    if (messages && prop) {
      messages = form.get('messages')[ prop ]
    }
    this.set({
      'rules': rules,
      'messages': messages,
      'defaultValue': form.get('value')
    })

    if (!this.get('width')) {
      this.set({
        'width': form.get('labelWidth')
      })
    }
    if (!this.get('isShowError')) {
      this.set({
        'isShowError': form.get('showMessage')
      })
    }
    if (!this.get('required') && rules) {
      this.set({
        'required': rules[ 'required' ]
      })
    }
  }
})