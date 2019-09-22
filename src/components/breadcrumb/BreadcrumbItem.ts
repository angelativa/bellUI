import Yox from 'yox'

import template from './template/BreadcrumbItem.hbs'

import {
  FALSE,
  RAW_STRING,
  RAW_BOOLEAN,
} from '../constant'
import { findComponentUpward } from '../util'

export default Yox.define({
  template,
  propTypes: {
    href: {
      type: RAW_STRING,
    },
    target: {
      type: RAW_STRING,
    },
    last: {
      type: RAW_BOOLEAN,
      value: FALSE,
    },
    className: {
      type: RAW_STRING,
    },
    style: {
      type: RAW_STRING,
    }
  },
  data(options) {
    const breadcrumb = findComponentUpward(options.parent, '${prefix}breadcrumb')
    return {
      separator: breadcrumb.get('separator')
    }
  }
})