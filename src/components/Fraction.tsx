import React from 'react';

interface FractionProps extends React.HTMLAttributes<HTMLDivElement> {
    numerator: number;
    denominator: number;
}

export default function Fraction({ numerator, denominator, ...props }: FractionProps) {
    return (
        <span {...props}>
            {numerator}&frasl;{denominator}
            {/* <sup>{numerator}</sup>&frasl;<sub>{denominator}</sub> */}
        </span>
        // <div className={twMerge('flex flex-col', className)} {...props}>
        //     <div>{numerator}</div>
        //     <hr />
        //     <div>{denominator}</div>
        // </div>
    );
}
