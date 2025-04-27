import cn, { Argument } from 'classnames';
import React from 'react';

import Container from '../Container';
import styles from './StageContainer.module.css';

interface StageContainerProps {
    handleBack?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
    handleNext?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
    nextCondition?: boolean;
    extraButtons?: React.HTMLAttributes<HTMLButtonElement>[];
    className?: Argument;
    children?: React.ReactNode;
}

export default function StageContainer({
    handleBack,
    handleNext,
    nextCondition = true,
    extraButtons,
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
                {extraButtons?.map(({ className, ...props }, index) => (
                    <button key={index} className={cn(styles.button, className)} {...props} />
                ))}
            </div>
        </Container>
    );
}

function Title({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return <span className={cn(className, styles.title)} {...props} />;
}

StageContainer.Title = Title;
