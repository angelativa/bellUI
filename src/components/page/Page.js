export default {
    template: `
        <div class="bell-page
            {{#if size}} bell-page-{{size}}{{/if}}
            {{#if className}} {{className}}{{/if}}
        "{{#if style}} style="{{style}}"{{/if}}>
            {{#partial pageCenter}}
                {{#if current - 3 > 1}}
                    <li class="bell-page-item bell-page-item-prev" on-click="fastPrev()">
                        <i class="bell-icon bell-icon-ios-arrow-left"></i>
                        <i class="bell-icon bell-icon-ios-arrow-left"></i>
                    </li>
                {{/if}}

                {{#if current - 2 > 1}}
                    <li class="bell-page-item" on-click="changePage(current - 2)">
                        {{ current - 2 }}
                    </li>
                {{/if}}

                {{#if current - 1 > 1}}
                    <li class="bell-page-item" on-click="changePage(current - 1)">
                        {{ current - 1 }}
                    </li>
                {{/if}}

                {{#if current != 1 && current != count}}
                    <li class="bell-page-item bell-active">
                        {{ current }}
                    </li>
                {{/if}}

                {{#if current + 1 < count}}
                    <li class="bell-page-item" on-click="changePage(current + 1)">
                        {{ current + 1 }}
                    </li>
                {{/if}}

                {{#if current + 2 < count}}
                    <li class="bell-page-item" on-click="changePage(current + 2)">
                        {{ current + 2 }}
                    </li>
                {{/if}}

                {{#if current + 3 < count}}
                    <li class="bell-page-item bell-page-item-next" on-click="fastNext()">
                        <i class="bell-icon bell-icon-ios-arrow-right"></i>
                        <i class="bell-icon bell-icon-ios-arrow-right"></i>
                    </li>
                {{/if}}
            {{/partial}}

            {{#if showTotal}}
            <span class="bell-page-total">
                共 {{total}} 条
            </span>
            {{/if}}

            {{#if showSizer}}
            <div class="bell-page-select">
                <Select list="{{pageList}}"
                    model="pageSize"
                    size="{{size}}"
                    placement="{{placement}}"
                />
            </div>
            {{/if}}

            {{#if !simple}}
            <ul class="bell-page-list">

                <li class="bell-page-item bell-page-prev{{#if current <= 1}} bell-disabled{{/if}}" on-click="prev()">
                    <i class="bell-icon bell-icon-ios-arrow-left"></i>
                </li>

                <li class="bell-page-item{{#if current == 1}} bell-active{{/if}}" on-click="changePage(1)">
                    1
                </li>

                {{#if count > 1}}
                    {{> pageCenter}}
                    <li class="bell-page-item{{#if current == count}} bell-active{{/if}}" on-click="changePage(count)">
                        {{count}}
                    </li>
                {{/if}}

                <li class="bell-page-item bell-page-next {{count}}{{#if current >= count}} bell-disabled{{/if}}" on-click="next()">
                    <i class="bell-icon bell-icon-ios-arrow-right"></i>
                </li>
            </ul>

            {{else}}
                <div class="bell-page-simple">
                    <span class="bell-page-item bell-page-prev{{#if current <= 1}} bell-disabled{{/if}}" on-click="prev()">
                        <i class="bell-icon bell-icon-ios-arrow-left"></i>
                    </span>

                    <div class="bell-page-input">
                        <Input type="input"
                            model="currentPage"
                            size="{{size}}"
                        ></Input>
                    </div>

                    {{'/'}}

                    <span class="bell-page-item{{#if current == count}} bell-active{{/if}}" on-click="changePage(count)">
                        {{count}}
                    </span>

                    <span class="bell-page-item bell-page-next {{count}}{{#if current >= count}} bell-disabled{{/if}}" on-click="next()">
                        <i class="bell-icon bell-icon-ios-arrow-right"></i>
                    </span>
                </div>
            {{/if}}

            {{#if showElevator}}
                <div class="bell-page-elevator">
                    跳至
                    <div class="bell-page-input">
                        <Input type="input"
                            placeholder="请输入..."
                            model="currentPage"
                            size="{{size}}"
                        ></Input>
                    </div>
                    页
                </div>
            {{/if}}
        </div>
    `,

    propTypes: {
        className: {
            type: 'string'
        },
        style: {
            type: 'string'
        },
        size: {
            type: 'string'
        },
        simple: {
            type: 'string'
        },
        total: {
            type: 'numeric'
        },
        current: {
            type: 'numeric',
            value: 1
        },
        pageSize: {
            type: 'numeric',
            value: 10
        },
        showSizer: {
            type: ['numeric', 'boolean']
        },
        pageSizeOpts: {
            type: 'array'
        },
        showElevator: {
            type: ['numeric', 'boolean']
        },
        showTotal: {
            type: ['numeric', 'boolean']
        },
        placement: {
            type: 'string'
        },
        onPageSizeChange: {
            type: 'function'
        }
    },

    data() {
        let me = this;
        let getPageList = () => {
            let pageList = [];
            if (me.get('showSizer')
                && me.get('pageSizeOpts')
            ) {
                Yox.array.each(
                    me.get('pageSizeOpts'),
                    (value) => {
                        pageList.push({
                            text: value + ' 条/页',
                            val: value
                        });
                    }
                );
            }
            return pageList;
        };
        return {
            pageList: getPageList(),
            count: 0,
            currentPage: 1
        }
    },

    watchers: {
        pageSize(value) {
            let me = this;
            me.updateCount();
            me.get('onPageSizeChange') && me.get('onPageSizeChange')(value);
        },
        current(value) {
            this.fire(
                'change',
                {
                    value: value
                }
            );
        }
    },

    methods: {

        fastPrev() {
            let me = this;
            if (me.get('current') < 1) {
                return;
            }
            me.decrease('current', 5, 1);
        },

        fastNext() {
            let me = this;
            if (me.get('current') >= me.get('count')) {
                return;
            }
            me.increase('current', 5, me.get('count'));
        },

        prev() {
            let me = this;
            if (me.get('current') < 1) {
                return;
            }
            me.decrease('current', 1, 1);

            if (me.get('simple')) {
                me.decrease('currentPage', 1, 1);
            }
        },

        next() {
            let me = this;
            if (me.get('current') >= me.get('count')) {
                return;
            }
            me.increase('current', 1, me.get('count'));
            if (me.get('simple')) {
                me.increase('currentPage', 1, me.get('count'));
            }
        },

        changePage(page) {
            this.set({
                current: page,
                currentPage: page
            });
        },

        updateCount() {
            let me = this;
            if (me.get('total')) {
                let count = 1;
                if (me.get('total') > me.get('pageSize')) {
                    count = Math.ceil(me.get('total') / me.get('pageSize'));
                }

                me.set({
                    count: count
                });
            }
        },

        setCurrent(option) {
            let me = this;
            let currentPage = +me.get('currentPage');
            let current = me.get('current');
            let count = me.get('count');

            if (option == 'enter') {
                if (Yox.is.number(currentPage)
                    && currentPage > 0
                    && currentPage <= count
                ) {
                    current = currentPage;
                }
            }
            else if (option == 'up') {
                current = current > 1 ? current - 1 : 1;
            }
            else if (option == 'down') {
                current = current + 1 > count ? count : current + 1;
            }

            me.set({
                current: current,
                currentPage: current
            });
        }
    },

    afterMount() {
        let me = this;
        me.updateCount();

        me.documentKeydownHander = (e) => {
            let code = e.keyCode;
            if (code === 40) {
                // up
                e.preventDefault();
                me.setCurrent('down');
            }
            else if (code === 38) {
                // down
                e.preventDefault();
                me.setCurrent('up');
            }
            else if (code == 13) {
                // enter
                e.preventDefault();
                me.setCurrent('enter');
            }
        };

        document.addEventListener(
            'keydown',
            me.documentKeydownHander
        );
    },

    beforeDestroy() {
        let me = this;
        document.removeEventListener(
            'keydown',
            me.documentKeydownHander
        );
    }
};