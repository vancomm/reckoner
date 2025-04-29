import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={twMerge(
                'bg-opacity-30 flex w-[min(32em,_100%)] flex-col items-center gap-4 rounded-2xl bg-[rgba(0,_0,_0,_.3)] p-4 text-white',
                className
            )}
            {...props}
        />
    );
}
