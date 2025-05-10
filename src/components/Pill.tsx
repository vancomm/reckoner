import { twMerge } from 'tailwind-merge';

export type PillProps = React.HTMLAttributes<HTMLDivElement>;

export default function Pill({ className, ...props }: PillProps) {
    return (
        <div
            className={twMerge(
                'pill flex cursor-pointer items-center gap-1 bg-black/30 p-1 font-semibold transition-colors select-none hover:bg-black/50',
                className
            )}
            {...props}
        />
    );
}
