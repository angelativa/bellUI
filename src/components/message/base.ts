import Yox, { Data } from 'yox'
import template from './template/Message.hbs'
import {
  TRUE,
  RAW_BOOLEAN,
  RAW_STRING,
  FALSE
} from '../constant'
import { onTransitionEnd } from '../util';

let id = 0

const createMessage = function (data: Data) {

  const namespace = '${prefix}message-' + id++
  const element = Yox.dom.createElement('div') as HTMLElement
  Yox.dom.prop(element, 'id', namespace)
  Yox.dom.append(document.body, element)

  let instance = new Yox({
    el: '#' + namespace,
    replace: TRUE,
    template,
    props: {
      content: data.content,
      type: data.type,
      showIcon: data.showIcon,
      closable: data.closable,
      closeText: data.closeText,
      center: data.center
    },
    propTypes: {
      content: {
        type: RAW_STRING
      },
      type: {
        type: RAW_STRING
      },
      showIcon: {
        type: RAW_BOOLEAN,
        value: TRUE
      },
      closable: {
        type: RAW_BOOLEAN
      },
      closeText: {
        type: RAW_STRING
      },
      center: {
        type: RAW_BOOLEAN
      }
    },

    data() {
      return {
        marginLeft: 0,
        top: data.top || 15,
        showTime: data.duration || 1500,
        isShow: FALSE,
        close() {
          if (instance) {
            instance.destroy()
          }
          if (Yox.is.func(data.onClose)) {
            data.onClose()
          }
        }
      }
    },

    methods: {
      fadeIn() {
        let me = this
        setTimeout(
          function () {
            if (!me.$el) {
              return
            }
            me.set({
              isShow: true,
              top: me.get('top')
            })
            me.fadeOut()
          },
          300
        )
      },
      fadeOut() {
        let me = this
        setTimeout(
          function () {
            if (!me.$el) {
              return
            }
            me.set({
              isShow: false,
              top: 0
            })

            onTransitionEnd(
              me.$el,
              function () {
                if (Yox.is.func(data.onClose)) {
                  data.onClose()
                }
              }
            )
          },
          me.get('showTime')
        )
      }
    },

    afterMount() {
      let me = this
      me.set({
        marginLeft: me.$el.clientWidth
      })

      me.fadeIn()
    }
  })
}

export const add = function (data: Data) {
  createMessage(data)
}