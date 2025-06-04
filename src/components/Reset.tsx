import Replay from '@mui/icons-material/Replay';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Reset({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={twMerge(
                'flex cursor-pointer items-center gap-x-0.5 text-white/60 transition-colors hover:text-white/80',
                className
            )}
            {...props}
        >
            <Replay fontSize="small" />
            <span>заново</span>
        </button>
    );
}
