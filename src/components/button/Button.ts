import Yox from 'yox'

import template from './template/Button.hbs'

import { oneOf } from '../util'

import {
  RAW_TINY,
  RAW_SMALL,
  RAW_LARGE,
  RAW_DEFAULT,
  RAW_STRING,
  RAW_BOOLEAN,
  RAW_TYPE_ARRAY
} from '../constant'

export default Yox.create({
  propTypes: {
    type: {
      type: oneOf(RAW_TYPE_ARRAY),
      value: RAW_DEFAULT
    },
    size: {
      type: oneOf([ RAW_TINY, RAW_SMALL, RAW_LARGE ])
    },
    borderType: {
      type: oneOf(['solid', 'none', 'dashed']),
      value: 'solid'
    },
    shape: {
      type: RAW_STRING
    },
    fluid: {
      type: RAW_BOOLEAN
    },
    disabled: {
      type: RAW_BOOLEAN
    },
    ghost: {
      type: RAW_BOOLEAN
    },
    className: {
      type: RAW_STRING
    },
    style: {
      type: RAW_STRING
    }
  },
  template,
})