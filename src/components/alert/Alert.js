export default {
    template: `
<div class="bell-alert
{{#if type}} bell-alert-{{type}}{{/if}}
{{#if hasDesc}} bell-alert-with-desc{{/if}}
{{#if showIcon}} bell-alert-with-icon{{/if}}
{{#if center}} bell-alert-center{{/if}}
">
    {{#if showIcon}}
    <span class="bell-alert-icon">
        <i class="bell-icon
        {{#if type == 'info'}} icon-information-circled
        {{else if type == 'success'}} icon-checkmark-circled
        {{else if type == 'warning'}} icon-android-alert
        {{else if type == 'error'}} icon-close-circled
        {{/if}}
        "></i>
    </span>
    {{/if}}

    <span class="bell-alert-content" style="padding-right: {{paddingRight}}px">
        <slot name="children" />
    </span>

    {{#if closable}}
    <span ref="close" class="bell-alert-close" on-click="close()">
        {{#if closeText}}
            {{closeText}}
        {{else}}
            <i class="bell-icon icon-ios-close-empty"></i>
        {{/if}}
    </span>
    {{/if}}
</div>
    `,

    propTypes: {
        type: {
            type: 'string',
            value: 'info'
        },
        closable: {
            type: ['string', 'boolean']
        },
        showIcon: {
            type: ['string', 'boolean']
        },
        center: {
            type: ['string', 'boolean']
        },
        closeText: {
            type: 'string'
        },
        close: {
            type: 'function'
        }
    },

    data: function () {
        return {
            hasDesc: false,
            paddingRight: 0
        }
    },

    watchers: {

    },

    methods: {
        close: function () {
            let me = this;
            let container = me.$el;
            let classNames = container.getAttribute('class');
            container.setAttribute('class', classNames + ' bell-hide');
            setTimeout(
                function () {
                    container.remove()
                },
                500
            );
            me.get('close') && me.get('close')();
        }
    },

    afterMount: function () {
        let me = this;
        let children = me.$options.props.$children;
        if (Yox.is.array(children)
            && me.$options.props.$children.length
        ) {
            me.$options.props.$children.some(child => {
                if (child.tag == 'Desc') {
                    me.set({
                        hasDesc: true
                    });
                }
            });
        }
        if (me.get('closable')) {
            me.set({
                paddingRight: me.$refs.close.clientWidth
            });
        }
    },

    beforeDestroy: function () {
    }
};