import { twMerge } from 'tailwind-merge';

export type PillProps = React.HTMLAttributes<HTMLDivElement>;

export default function Pill({ className, ...props }: PillProps) {
    return <div className={twMerge('flex cursor-pointer items-center gap-1 font-semibold transition-colors select-none', className)} {...props} />;
}
