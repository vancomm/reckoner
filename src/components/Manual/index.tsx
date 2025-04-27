import React from 'react';
import ReactMarkdown from 'react-markdown';
import { twMerge } from 'tailwind-merge';

import { useAppState } from '../../contexts/AppStateContext';
import idbCache from '../../lib/idbCache';
import Button from '../Button';
import Carousel from '../Carousel';
import Container from '../Container';
import CrossIcon from '../CrossIcon';
import styles from './Manual.module.css';

const pageSources = [
    './data/manual-page-one.md',
    './data/manual-page-two.md',
    './data/manual-page-three.md',
    './data/manual-page-four.md',
    './data/manual-page-five.md',
] as const;

export default function Manual() {
    const {
        uiState: { setShowManual },
    } = useAppState();

    const [ready, setReady] = React.useState(false);
    const [pages, setPages] = React.useState<string[]>([]);

    React.useEffect(() => {
        Promise.all(
            pageSources.map((url) =>
                fetch(url)
                    .then((r) => r.text())
                    .then((t) => t.trim())
            )
        ).then((texts) => {
            setPages(texts.filter(Boolean));
            setReady(true);
        });
    }, []);

    return (
        <Container className={twMerge(styles.manualContainer, !ready && 'hidden')}>
            <div className={styles.manualControls}>
                <Button
                    label="don't show again"
                    className={styles.dontShowAgain}
                    onClick={() => {
                        setShowManual(false);
                        idbCache.set('showManual', false);
                    }}
                />
                <Button onClick={() => setShowManual(false)}>
                    <CrossIcon className={styles.dismissIcon} />
                </Button>
            </div>

            <div className={styles.content}>
                <Carousel>
                    {pages.map(
                        (text, i) =>
                            text && (
                                <Carousel.Item key={`carousel-item-${i}`} id={`carousel-item-${i}`}>
                                    <ReactMarkdown>{text}</ReactMarkdown>
                                </Carousel.Item>
                            )
                    )}
                </Carousel>
            </div>
        </Container>
    );
}
