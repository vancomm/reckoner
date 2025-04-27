import cn, { Argument } from 'classnames';

import { Customizable } from '../../types/Customizable';
import { Nestable } from '../../types/Nestable';
import Container from '../Container';
import styles from './StageContainer.module.css';

interface CustomControl extends Customizable {
    label: string;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}

interface StageContainerProps {
    handleBack?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    handleNext?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    nextCondition?: boolean;
    customControls?: CustomControl[];
    className?: Argument;
    children?: React.ReactNode;
}

export default function StageContainer({
    handleBack,
    handleNext,
    nextCondition = true,
    customControls,
    className,
    children,
}: StageContainerProps) {
    return (
        <Container className={cn(className)}>
            {children}
            <div className={styles.buttonContainer}>
                {handleBack && (
                    <button className={styles.button} onClick={handleBack}>
                        Back
                    </button>
                )}
                {handleNext && (
                    <button className={cn(styles.button, styles.next)} disabled={!nextCondition} onClick={handleNext}>
                        Next
                    </button>
                )}
                {customControls?.map(({ label, disabled, onClick, className, style }, index) => (
                    <button
                        key={index}
                        className={cn(styles.button, className)}
                        onClick={onClick}
                        disabled={disabled}
                        style={style}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </Container>
    );
}

function Title({ children }: Nestable) {
    return <span className={styles.title}>{children}</span>;
}

StageContainer.Title = Title;
