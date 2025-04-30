import { twMerge } from 'tailwind-merge';

import Clear from '@/components/Clear';

export interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
    onClose?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Pill({ onClose, className, children, ...props }: PillProps) {
    return (
        <div
            className={twMerge(
                'grid cursor-pointer grid-flow-col items-center gap-1 rounded-sm bg-black/30 p-1 font-semibold transition-colors select-none hover:bg-black/50',
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-1 p-0.5">{children}</div>
            {onClose && (
                <>
                    <div className="h-[80%] border-x-1 border-white/10" />
                    <button className="cursor-pointer p-0.5" onMouseDown={onClose} tabIndex={-1}>
                        <Clear width="1em" height="1em" className="fill-white/50 hover:fill-white" />
                    </button>
                </>
            )}
        </div>
    );
}
