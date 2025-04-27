import cn from 'classnames';
import React from 'react';

interface FractionProps extends React.HTMLAttributes<HTMLSpanElement> {
    numerator: number;
    denominator: number;
}

export default function Fraction({ numerator, denominator, className }: FractionProps) {
    return (
        <span className={cn(className)}>
            <sup>{numerator}</sup>&frasl;<sub>{denominator}</sub>
        </span>
    );
}
