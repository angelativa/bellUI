import template from './template/MenuItem.html'
import { findComponentUpward } from '../util'

export default {
  propTypes: {
    name: {
      type: 'string'
    },
    hash: {
      type: 'string'
    },
    disabled: {
      type: 'boolean'
    },
    className: {
      type: 'string'
    },
    style: {
      type: 'string'
    }
  },

  template,

  data() {
    return {
      mode: null,
      isActive: false,
      isCollapsed: false
    }
  },

  events: {
    menuItemSelected(event, data) {
      if (event.phase === Yox.Event.PHASE_DOWNWARD) {
        this.set('isActive', data.name === this.get('name'))
      }
    },
    isCollapsedChanged(_, data) {
      this.set('isCollapsed', data.isCollapsed)
    }
  },

  methods: {
    click() {
      this.fire('menuItemSelected', {
        name: this.get('name')
      })
    }
  },

  afterMount () {
    let element = findComponentUpward(this, '${prefix}menu')
    this.set({
      'mode': element.get('mode'),
      'isActive': element.get('activeName') === this.get('name')
    })
  }
}