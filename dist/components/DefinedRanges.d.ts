import React from 'react';
import { DateRange, DefinedRange } from '../types';
declare type DefinedRangesProps = {
    setRange: (range: DateRange) => void;
    selectedRange: DateRange;
    ranges: DefinedRange[];
};
declare const DefinedRanges: React.FunctionComponent<DefinedRangesProps>;
export default DefinedRanges;
