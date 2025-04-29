import React from 'react';
import { twMerge } from 'tailwind-merge';

interface FractionProps extends React.HTMLAttributes<HTMLDivElement> {
    numerator: number;
    denominator: number;
}

export default function Fraction({ numerator, denominator, className, ...props }: FractionProps) {
    return (
        // <span {...props}>
        //     <sup>{numerator}</sup>&frasl;<sub>{denominator}</sub>
        // </span>
        <div className={twMerge('flex flex-col', className)} {...props}>
            <div>{numerator}</div>
            <hr />
            <div>{denominator}</div>
        </div>
    );
}
