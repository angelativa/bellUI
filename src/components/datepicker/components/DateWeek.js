import {
    firstDateInWeek,
    lastDateInWeek,
    normalizeDate,
    firstDateInMonth,
    lastDateInMonth,
    simplifyDate,
    offsetMonth,
    parseDate,
    getOffsetTime
} from '../function/util'

const WEEKS = [
    '日',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六'
];

const DAY = 24 * 60 * 60 * 1000;
const stableDuration = 41 * DAY;

export default {
    template: `
        <div class="bell-datepicker-week">
            <div class="bell-datepicker-header">
                <span class="bell-datepicker-header-button" on-click="prevYear()">
                    <i class="bell-icon bell-text-medium bell-text-muted bell-icon-ios-arrow-left"></i>
                    <i class="bell-icon bell-text-medium bell-text-muted bell-icon-ios-arrow-left"></i>
                </span>

                <span class="bell-datepicker-header-button" on-click="prevMonth()">
                    <i class="bell-icon bell-text-medium bell-text-muted bell-icon-ios-arrow-left"></i>
                </span>

                <span class="bell-text-medium">
                    {{currentYear}} 年
                </span>
                <span class="bell-text-medium bell-datepicker-header-month">
                    {{currentMonth}} 月
                </span>

                <span class="bell-datepicker-header-button" on-click="nextMonth()">
                    <i class="bell-icon bell-text-medium bell-text-muted bell-icon-ios-arrow-right"></i>
                </span>

                <span class="bell-datepicker-header-button" on-click="nextYear()">
                    <i class="bell-icon bell-text-medium bell-text-muted bell-icon-ios-arrow-right"></i>
                    <i class="bell-icon bell-text-medium bell-text-muted bell-icon-ios-arrow-right"></i>
                </span>
            </div>
            <div class="bell-datepicker-table-week">
                <div class="bell-datepicker-weeks">
                    {{#each weeks}}
                        <span class="bell-datepicker-col">
                            {{this}}
                        </span>
                    {{/each}}
                </div>
                <div class="bell-datepicker-days">
                    {{#each dateList:index}}
                        <div class="bell-datepicker-row
                        {{#if checkedIndex == index}} bell-datepicker-row-checked{{/if}}
                        " on-click="click(this)">
                            {{#each this:key}}
                                <span
                                    class="bell-datepicker-col
                                    {{#if isCurrentMonth}} bell-datepicker-col-current-month{{/if}}
                                    {{#if isPrevMonth}} bell-datepicker-col-prev-month{{/if}}
                                    {{#if isLastMonth}} bell-datepicker-col-last-month{{/if}}
                                    {{#if isCurrentDate}} bell-datepicker-col-checked{{/if}}"
                                >
                                    {{date}}
                                </span>
                            {{/each}}
                        </div>
                    {{/each}}
                </div>
            </div>
        </div>
    `,

    propTypes: {
        week: {
            type: ['string', 'number']
        },
        firstDay: {
            type: ['number', 'string']
        }
    },

    data: function () {
        let me = this;
        return {
            weeks: WEEKS,
            modeDate: '',
            dateList: [],
            checkedIndex: ''
        }
    },

    computed: {
        currentYear: function () {
            var me = this;
            var date = me.get('modeDate');
            date = date ? simplifyDate(date) : simplifyDate(new Date());
            return date.year;
        },
        currentMonth: function () {
            var me = this;
            var date = me.get('modeDate');
            date = date ? simplifyDate(date) : simplifyDate(new Date());
            return date.month;
        }
    },

    methods: {
        changeDate: function (offset) {
            var me = this;

            date = offsetMonth(date, offset);

            me.set({
                dateList: me.createRenderData(date, me.get('checkedDate'))
            });
        },
        prevYear: function () {
            this.changeDate(-12);
        },
        prevMonth: function () {
            this.changeDate(-1);
        },
        nextYear: function () {
            this.changeDate(12);
        },
        nextMonth: function () {
            this.changeDate(1);
        },
        click: function (date) {
            var me = this;

            me.fire(
                'weekRangeChange',
                {
                    start: date[0],
                    end: date[date.length - 1]
                }
            );
            me.refresh(
                getOffsetTime(parseDate(date[0])),
                getOffsetTime(parseDate(date[date.length - 1]))
            );
        },
        refresh: function (start, end) {
            var me = this;
            var dateList = me.get('dateList');
            var checkedIndex = '';
            for (var i = 0; i < dateList.length; i++) {
                var item = dateList[i][0];
                var itemTime = getOffsetTime(parseDate(item));
                if (itemTime == start) {
                    checkedIndex = i;
                }
            }
            me.set({
                checkedIndex: checkedIndex
            });
        },
        // 获取渲染模板的数据
        getDatasource: function (start, end, date) {
            var me = this;
            var data = [];
            date = simplifyDate(date);
            for (var time = start, item; time <= end; time += DAY) {
                item = simplifyDate(time);
                if (item.year == date.year
                    && item.month == date.month
                    && item.date == date.date
                    && item.day == date.day
                ) {
                    item.isCurrentDate = true;
                }

                item.isPrevMonth = item.month < date.month;
                item.isCurrentMonth = item.month == date.month;
                item.isLastMonth = item.month > date.month;
                data.push(item);
            }
            return data;

        },
        createRenderData: function (date) {

            var me = this;
            var firstDay = me.get('firstDay') || 0;
            date = normalizeDate(date);

            var startDate;
            var endDate;

            startDate = firstDateInWeek(firstDateInMonth(date), firstDay);
            endDate = lastDateInWeek(lastDateInMonth(date), firstDay);

            startDate = normalizeDate(startDate);
            endDate = normalizeDate(endDate);

            var duration = endDate - startDate;
            var offset = stableDuration - duration;

            if (offset > 0) {
                endDate += offset;
            }

            var list = me.getDatasource(startDate, endDate, date);
            return me.format(list);
        },
        format: function (list) {
            var result = [];
            var arr = [];
            for(var i = 0; i < list.length; i++) {
                arr.push(list[i])
                if (i % 7 == 6) {
                    result.push(arr);
                    arr = [];
                }
            }
            return result;
        }
    },

    afterMount: function () {
        var me = this;

        var today = new Date();

        var date = me.get('week');
        date = date ? date : today;

        me.set({
            dateList: me.createRenderData(date)
        });
    },
    beforeDestroy: function () {
        var me = this;
    }
}