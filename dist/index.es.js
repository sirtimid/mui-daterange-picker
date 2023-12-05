import * as React from 'react';
import React__default from 'react';
import { Grid, IconButton, FormControl, Select, MenuItem, Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { parseISO, isValid, max, min, isSameMonth, addMonths, isSameDay, isWithinInterval, startOfWeek, startOfMonth, endOfWeek, endOfMonth, isBefore, addDays, addWeeks, startOfYear, endOfYear, addYears, getMonth, getYear, setMonth, setYear, format, isToday, getDate, differenceInCalendarMonths, isAfter } from 'date-fns';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

const chunks = (array, size) => (Array.from({ length: Math.ceil(array.length / size) }, (_v, i) => array.slice(i * size, i * size + size)));
// Date
const getDaysInMonth = (date, locale) => {
    const startWeek = startOfWeek(startOfMonth(date), { locale });
    const endWeek = endOfWeek(endOfMonth(date), { locale });
    const days = [];
    for (let curr = startWeek; isBefore(curr, endWeek);) {
        days.push(curr);
        curr = addDays(curr, 1);
    }
    return days;
};
const isStartOfRange = ({ startDate }, day) => (startDate && isSameDay(day, startDate));
const isEndOfRange = ({ endDate }, day) => (endDate && isSameDay(day, endDate));
const inDateRange = ({ startDate, endDate }, day) => (startDate
    && endDate
    && (isWithinInterval(day, { start: startDate, end: endDate })
        || isSameDay(day, startDate)
        || isSameDay(day, endDate)));
const isRangeSameDay = ({ startDate, endDate }) => {
    if (startDate && endDate) {
        return isSameDay(startDate, endDate);
    }
    return false;
};
const parseOptionalDate = (date, defaultValue) => {
    if (date) {
        const parsed = date instanceof Date ? date : parseISO(date);
        if (isValid(parsed))
            return parsed;
    }
    return defaultValue;
};
const getValidatedMonths = (range, minDate, maxDate) => {
    const { startDate, endDate } = range;
    if (startDate && endDate) {
        const newStart = max([startDate, minDate]);
        const newEnd = min([endDate, maxDate]);
        return [newStart, isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd];
    }
    return [startDate, endDate];
};

const getDefaultRanges = (date, locale) => [
    {
        label: 'Today',
        startDate: date,
        endDate: date,
    },
    {
        label: 'Yesterday',
        startDate: addDays(date, -1),
        endDate: addDays(date, -1),
    },
    {
        label: 'This Week',
        startDate: startOfWeek(date, { locale }),
        endDate: endOfWeek(date, { locale }),
    },
    {
        label: 'Last Week',
        startDate: startOfWeek(addWeeks(date, -1), { locale }),
        endDate: endOfWeek(addWeeks(date, -1), { locale }),
    },
    {
        label: 'Last 7 Days',
        startDate: addWeeks(date, -1),
        endDate: date,
    },
    {
        label: 'This Month',
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
    },
    {
        label: 'Last Month',
        startDate: startOfMonth(addMonths(date, -1)),
        endDate: endOfMonth(addMonths(date, -1)),
    },
    {
        label: 'This Year',
        startDate: startOfYear(date),
        endDate: endOfYear(date),
    },
    {
        label: 'Last Year',
        startDate: startOfYear(addYears(date, -1)),
        endDate: endOfYear(addYears(date, -1)),
    },
];

const generateYears = (relativeTo, count) => {
    const half = Math.floor(count / 2);
    return Array(count)
        .fill(0)
        .map((_y, i) => relativeTo.getFullYear() - half + i); // TODO: make part of the state
};
const Header = ({ date, setDate, nextDisabled, prevDisabled, onClickNext, onClickPrevious, locale, }) => {
    const MONTHS = typeof locale !== "undefined"
        ? [...Array(12).keys()].map((d) => { var _a; return (_a = locale.localize) === null || _a === void 0 ? void 0 : _a.month(d, { width: "abbreviated", context: "standalone" }); })
        : ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const handleMonthChange = (event) => {
        setDate(setMonth(date, parseInt(event.target.value, 10)));
    };
    const handleYearChange = (event) => {
        setDate(setYear(date, parseInt(event.target.value, 10)));
    };
    return (React__default.createElement(Grid, { container: true, justifyContent: "space-between", alignItems: "center" },
        React__default.createElement(Grid, { item: true, sx: { padding: "5px" } },
            React__default.createElement(IconButton, { sx: {
                    padding: "10px",
                    "&:hover": {
                        background: "none",
                    },
                }, disabled: prevDisabled, onClick: onClickPrevious },
                React__default.createElement(ChevronLeft, { color: prevDisabled ? "disabled" : "action" }))),
        React__default.createElement(Grid, { item: true },
            React__default.createElement(FormControl, { variant: "standard" },
                React__default.createElement(Select, { value: getMonth(date), onChange: handleMonthChange, disableUnderline: true }, MONTHS.map((month, idx) => (React__default.createElement(MenuItem, { key: month, value: idx }, month)))))),
        React__default.createElement(Grid, { item: true },
            React__default.createElement(FormControl, { variant: "standard" },
                React__default.createElement(Select, { value: getYear(date), onChange: handleYearChange, disableUnderline: true }, generateYears(date, 30).map((year) => (React__default.createElement(MenuItem, { key: year, value: year }, year)))))),
        React__default.createElement(Grid, { item: true, sx: { padding: "5px" } },
            React__default.createElement(IconButton, { sx: {
                    padding: "10px",
                    "&:hover": {
                        background: "none",
                    },
                }, disabled: nextDisabled, onClick: onClickNext },
                React__default.createElement(ChevronRight, { color: nextDisabled ? "disabled" : "action" })))));
};

const Day = ({ startOfRange, endOfRange, disabled, highlighted, outlined, filled, onClick, onHover, value, }) => {
    return (React__default.createElement(Box, { sx: {
            display: 'flex',
            // eslint-disable-next-line no-nested-ternary
            borderRadius: startOfRange ? '50% 0 0 50%' : endOfRange ? '0 50% 50% 0' : undefined,
            backgroundColor: (theme) => !disabled && highlighted ? theme.palette.primary.light : undefined,
        } },
        React__default.createElement(IconButton, { sx: Object.assign({ height: '36px', width: '36px', padding: 0, border: (theme) => !disabled && outlined ? `1px solid ${theme.palette.primary.dark}` : undefined }, (!disabled && filled ? {
                '&:hover': {
                    backgroundColor: (theme) => theme.palette.primary.dark,
                },
                backgroundColor: (theme) => theme.palette.primary.dark,
            } : {})), disabled: disabled, onClick: onClick, onMouseOver: onHover },
            React__default.createElement(Typography, { sx: {
                    lineHeight: 1.6,
                    color: (theme) => !disabled
                        ? (filled ? theme.palette.primary.contrastText : theme.palette.text.primary)
                        : theme.palette.text.secondary,
                }, variant: "body2" }, value))));
};

var NavigationAction;
(function (NavigationAction) {
    // eslint-disable-next-line no-unused-vars
    NavigationAction[NavigationAction["Previous"] = -1] = "Previous";
    // eslint-disable-next-line no-unused-vars
    NavigationAction[NavigationAction["Next"] = 1] = "Next";
})(NavigationAction || (NavigationAction = {}));

const Month = (props) => {
    var _a;
    const { helpers, handlers, value: date, dateRange, marker, setValue: setDate, minDate, maxDate, locale } = props;
    const weekStartsOn = ((_a = locale === null || locale === void 0 ? void 0 : locale.options) === null || _a === void 0 ? void 0 : _a.weekStartsOn) || 0;
    const WEEK_DAYS = typeof locale !== 'undefined'
        ? [...Array(7).keys()].map(d => { var _a; return (_a = locale.localize) === null || _a === void 0 ? void 0 : _a.day((d + weekStartsOn) % 7, { width: 'short', context: 'standalone' }); })
        : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const [back, forward] = props.navState;
    return (React__default.createElement(Paper, { square: true, elevation: 0, sx: { width: 290 } },
        React__default.createElement(Grid, { container: true },
            React__default.createElement(Header, { date: date, setDate: setDate, nextDisabled: !forward, prevDisabled: !back, onClickPrevious: () => handlers.onMonthNavigate(marker, NavigationAction.Previous), onClickNext: () => handlers.onMonthNavigate(marker, NavigationAction.Next), locale: locale }),
            React__default.createElement(Grid, { item: true, container: true, direction: "row", justifyContent: "space-between", sx: {
                    marginTop: "10px",
                    paddingLeft: "30px",
                    paddingRight: "30px"
                } }, WEEK_DAYS.map((day, index) => (React__default.createElement(Typography, { color: "textSecondary", key: index, variant: "caption" }, day)))),
            React__default.createElement(Grid, { item: true, container: true, direction: "column", justifyContent: "space-between", sx: {
                    paddingLeft: '15px',
                    paddingRight: '15px',
                    marginTop: '15px',
                    marginBottom: '20px'
                } }, chunks(getDaysInMonth(date, locale), 7).map((week, idx) => (React__default.createElement(Grid, { key: idx, container: true, direction: "row", justifyContent: "center" }, week.map((day) => {
                const isStart = isStartOfRange(dateRange, day);
                const isEnd = isEndOfRange(dateRange, day);
                const isRangeOneDay = isRangeSameDay(dateRange);
                const highlighted = inDateRange(dateRange, day) || helpers.inHoverRange(day);
                return (React__default.createElement(Day, { key: format(day, "dd-MM-yyyy"), filled: isStart || isEnd, outlined: isToday(day), highlighted: highlighted && !isRangeOneDay, disabled: !isSameMonth(date, day)
                        || !isWithinInterval(day, { start: minDate, end: maxDate }), startOfRange: isStart && !isRangeOneDay, endOfRange: isEnd && !isRangeOneDay, onClick: () => handlers.onDayClick(day), onHover: () => handlers.onDayHover(day), value: getDate(day) }));
            }))))))));
};

const isSameRange = (first, second) => {
    const { startDate: fStart, endDate: fEnd } = first;
    const { startDate: sStart, endDate: sEnd } = second;
    if (fStart && sStart && fEnd && sEnd) {
        return isSameDay(fStart, sStart) && isSameDay(fEnd, sEnd);
    }
    return false;
};
const DefinedRanges = ({ ranges, setRange, selectedRange, }) => (React__default.createElement(List, null, ranges.map((range, idx) => (React__default.createElement(ListItem, { button: true, key: idx, onClick: () => setRange(range), sx: [
        isSameRange(range, selectedRange) && {
            backgroundColor: (theme) => theme.palette.primary.dark,
            color: 'primary.contrastText',
            '&:hover': {
                color: 'inherit'
            }
        }
    ] },
    React__default.createElement(ListItemText, { primaryTypographyProps: {
            variant: 'body2',
            sx: {
                fontWeight: isSameRange(range, selectedRange)
                    ? 'bold'
                    : 'normal',
            },
        } }, range.label))))));

const MARKERS = {
    FIRST_MONTH: Symbol('firstMonth'),
    SECOND_MONTH: Symbol('secondMonth'),
};

/* eslint-disable object-curly-newline */
const Menu = (props) => {
    const { ranges, dateRange, minDate, maxDate, firstMonth, setFirstMonth, secondMonth, setSecondMonth, setDateRange, helpers, handlers, locale } = props;
    const { startDate, endDate } = dateRange;
    const canNavigateCloser = differenceInCalendarMonths(secondMonth, firstMonth) >= 2;
    const commonProps = {
        dateRange, minDate, maxDate, helpers, handlers,
    };
    return (React__default.createElement(Paper, { elevation: 5, square: true },
        React__default.createElement(Grid, { container: true, direction: "row", wrap: "nowrap" },
            React__default.createElement(Grid, null,
                React__default.createElement(DefinedRanges, { selectedRange: dateRange, ranges: ranges, setRange: setDateRange })),
            React__default.createElement(Divider, { orientation: "vertical", flexItem: true }),
            React__default.createElement(Grid, null,
                React__default.createElement(Grid, { container: true, sx: { padding: '20px 70px' }, alignItems: "center" },
                    React__default.createElement(Grid, { item: true, sx: { flex: 1, textAlign: 'center' } },
                        React__default.createElement(Typography, { variant: "subtitle1" }, startDate ? format(startDate, 'dd MMMM yyyy', { locale }) : 'Start Date')),
                    React__default.createElement(Grid, { item: true, sx: { flex: 1, textAlign: 'center' } },
                        React__default.createElement(ArrowRightAlt, { color: "action" })),
                    React__default.createElement(Grid, { item: true, sx: { flex: 1, textAlign: 'center' } },
                        React__default.createElement(Typography, { variant: "subtitle1" }, endDate ? format(endDate, 'dd MMMM yyyy', { locale }) : 'End Date'))),
                React__default.createElement(Divider, null),
                React__default.createElement(Grid, { container: true, direction: "row", justifyContent: "center", wrap: "nowrap" },
                    React__default.createElement(Month, Object.assign({}, commonProps, { value: firstMonth, setValue: setFirstMonth, navState: [true, canNavigateCloser], marker: MARKERS.FIRST_MONTH, locale: locale })),
                    React__default.createElement(Divider, { orientation: "vertical", flexItem: true }),
                    React__default.createElement(Month, Object.assign({}, commonProps, { value: secondMonth, setValue: setSecondMonth, navState: [canNavigateCloser, true], marker: MARKERS.SECOND_MONTH, locale: locale })))))));
};

const DateRangePicker = (props) => {
    const today = new Date();
    const { open, onChange, initialDateRange, minDate, maxDate, definedRanges = getDefaultRanges(new Date(), props.locale), locale, } = props;
    const minDateValid = parseOptionalDate(minDate, addYears(today, -10));
    const maxDateValid = parseOptionalDate(maxDate, addYears(today, 10));
    const [intialFirstMonth, initialSecondMonth] = getValidatedMonths(initialDateRange || {}, minDateValid, maxDateValid);
    const [dateRange, setDateRange] = React.useState(Object.assign({}, initialDateRange));
    const [hoverDay, setHoverDay] = React.useState();
    const [firstMonth, setFirstMonth] = React.useState(intialFirstMonth || today);
    const [secondMonth, setSecondMonth] = React.useState(initialSecondMonth || addMonths(firstMonth, 1));
    const { startDate, endDate } = dateRange;
    // handlers
    const setFirstMonthValidated = (date) => {
        if (isBefore(date, secondMonth)) {
            setFirstMonth(date);
        }
    };
    const setSecondMonthValidated = (date) => {
        if (isAfter(date, firstMonth)) {
            setSecondMonth(date);
        }
    };
    const setDateRangeValidated = (range) => {
        let { startDate: newStart, endDate: newEnd } = range;
        if (newStart && newEnd) {
            range.startDate = newStart = max([newStart, minDateValid]);
            range.endDate = newEnd = min([newEnd, maxDateValid]);
            setDateRange(range);
            onChange(range);
            setFirstMonth(newStart);
            setSecondMonth(isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd);
        }
        else {
            const emptyRange = {};
            setDateRange(emptyRange);
            onChange(emptyRange);
            setFirstMonth(today);
            setSecondMonth(addMonths(firstMonth, 1));
        }
    };
    const onDayClick = (day) => {
        if (startDate && !endDate && !isBefore(day, startDate)) {
            const newRange = { startDate, endDate: day };
            onChange(newRange);
            setDateRange(newRange);
        }
        else {
            setDateRange({ startDate: day, endDate: undefined });
        }
        setHoverDay(day);
    };
    const onMonthNavigate = (marker, action) => {
        if (marker === MARKERS.FIRST_MONTH) {
            const firstNew = addMonths(firstMonth, action);
            if (isBefore(firstNew, secondMonth))
                setFirstMonth(firstNew);
        }
        else {
            const secondNew = addMonths(secondMonth, action);
            if (isBefore(firstMonth, secondNew))
                setSecondMonth(secondNew);
        }
    };
    const onDayHover = (date) => {
        if (startDate && !endDate) {
            if (!hoverDay || !isSameDay(date, hoverDay)) {
                setHoverDay(date);
            }
        }
    };
    // helpers
    const inHoverRange = (day) => (startDate
        && !endDate
        && hoverDay
        && isAfter(hoverDay, startDate)
        && isWithinInterval(day, { start: startDate, end: hoverDay }));
    const helpers = {
        inHoverRange,
    };
    const handlers = {
        onDayClick,
        onDayHover,
        onMonthNavigate,
    };
    return open ? (React.createElement(Menu, { dateRange: dateRange, minDate: minDateValid, maxDate: maxDateValid, ranges: definedRanges, firstMonth: firstMonth, secondMonth: secondMonth, setFirstMonth: setFirstMonthValidated, setSecondMonth: setSecondMonthValidated, setDateRange: setDateRangeValidated, helpers: helpers, handlers: handlers, locale: locale })) : null;
};

const DateRangePickerWrapper = (props) => {
    const { closeOnClickOutside, wrapperClassName, toggle, open, } = props;
    const handleToggle = () => {
        if (closeOnClickOutside === false) {
            return;
        }
        toggle();
    };
    const handleKeyPress = (event) => (event === null || event === void 0 ? void 0 : event.key) === 'Escape' && handleToggle();
    return (React__default.createElement(Box, { sx: { position: 'relative' } },
        open && (React__default.createElement(Box, { sx: {
                position: 'fixed',
                height: '100vh',
                width: '100vw',
                bottom: 0,
                zIndex: 0,
                right: 0,
                left: 0,
                top: 0,
            }, onKeyPress: handleKeyPress, onClick: handleToggle })),
        React__default.createElement(Box, { sx: { position: 'relative', zIndex: 1 }, className: wrapperClassName },
            React__default.createElement(DateRangePicker, Object.assign({}, props)))));
};

const DateRangePickerExporter = (props) => (React__default.createElement(DateRangePickerWrapper, Object.assign({}, props)));

export { DateRangePickerExporter as DateRangePicker, DateRangePicker as DateRangePickerComponent };
//# sourceMappingURL=index.es.js.map
