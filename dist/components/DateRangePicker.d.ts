import * as React from 'react';
import { DateRange, DefinedRange } from '../types';
interface DateRangePickerProps {
    open: boolean;
    initialDateRange?: DateRange;
    definedRanges?: DefinedRange[];
    minDate?: Date | string;
    maxDate?: Date | string;
    onChange: (dateRange: DateRange) => void;
    locale?: Locale;
}
declare const DateRangePicker: React.FunctionComponent<DateRangePickerProps>;
export default DateRangePicker;
