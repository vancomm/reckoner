import React from 'react';
import { twMerge } from 'tailwind-merge';

import Button from './Button';
import Carousel from './Carousel';
import Close from './Close';
import Container from './Container';
import styles from './Manual.module.css';

interface ManualProps {
    pages: React.ReactNode[];
    onClose?: () => unknown;
    onOptOut?: () => unknown;
}

export default function Manual({ pages, onClose, onOptOut }: ManualProps) {
    return (
        <Container className={twMerge(styles.manualContainer)}>
            <div className={styles.manualControls}>
                <Button label="don't show again" className={styles.dontShowAgain} onClick={onOptOut} />
                <Button onClick={onClose}>
                    <Close className={styles.dismissIcon} />
                </Button>
            </div>

            <div className={styles.content}>
                <Carousel>
                    {pages.map(
                        (page, i) =>
                            page && (
                                <Carousel.Item
                                    key={`carousel-item-${i}`}
                                    id={`carousel-item-${i}`}
                                    className="prose prose-sm"
                                >
                                    {page}
                                </Carousel.Item>
                            )
                    )}
                </Carousel>
            </div>
        </Container>
    );
}
