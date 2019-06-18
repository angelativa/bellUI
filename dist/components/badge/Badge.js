import template from './template/Badge.html';
import { RAW_STRING, RAW_BOOLEAN, RAW_NUMERIC, RAW_TYPE_ARRAY, RAW_TYPE_ERROR, FALSE } from '../constant';
import { oneOf } from '../util';
export default {
    propTypes: {
        text: {
            type: RAW_STRING
        },
        count: {
            type: RAW_NUMERIC
        },
        maxCount: {
            type: RAW_NUMERIC,
            value: 999
        },
        dot: {
            type: RAW_BOOLEAN,
            value: FALSE
        },
        hidden: {
            type: RAW_BOOLEAN,
            value: FALSE
        },
        type: {
            type: oneOf(RAW_TYPE_ARRAY),
            value: RAW_TYPE_ERROR
        },
        status: {
            type: oneOf(RAW_TYPE_ARRAY)
        },
        className: {
            type: RAW_STRING
        },
        style: {
            type: RAW_STRING
        }
    },
    template: template,
    filters: {
        isNumber: function (count) {
            return Yox.is.numeric(count);
        },
        formatText: function (count, maxCount) {
            count = Yox.is.numeric(count) ? +count : 0;
            maxCount = Yox.is.numeric(maxCount) ? +maxCount : 1;
            return maxCount < count
                ? maxCount + '+'
                : count;
        }
    }
};
//# sourceMappingURL=Badge.js.map