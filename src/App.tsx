import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import Manual from './components/Manual';
import ReceiptStage from './components/ReceiptStage';
import { useAppState } from './contexts/AppStateContext';
import idbCache from './lib/idbCache';
import ItemsStage from './stages/ItemsStage';
import NamesStage from './stages/NamesStage';
import ResultsStage from './stages/ResultsStage';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stages = ['receipt', 'names', 'items', 'results'] as const;

type Stage = (typeof stages)[number];

const pageSources = [
    './data/manual-page-one.md',
    './data/manual-page-two.md',
    './data/manual-page-three.md',
    './data/manual-page-four.md',
    './data/manual-page-five.md',
] as const;

export default function App() {
    const [stage, setStage] = useState<Stage>('receipt');
    const {
        uiState: { showManual, setShowManual },
    } = useAppState();

    const [pages, setPages] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (pageSources) {
            Promise.all(
                pageSources.map((url) =>
                    fetch(url)
                        .then((r) => r.text())
                        .then((t) => t.trim())
                )
            ).then((texts) => {
                setPages(texts.filter(Boolean));
            });
        }
    }, []);

    return (
        <div className="app">
            <main>
                {showManual && pages && (
                    <Manual
                        pages={pages.map((text) => (
                            <ReactMarkdown>{text}</ReactMarkdown>
                        ))}
                        onClose={() => setShowManual(false)}
                        onOptOut={() => {
                            setShowManual(false);
                            idbCache.set('hideWelcomeMessage', false);
                        }}
                    />
                )}
                {stage === 'receipt' && <ReceiptStage nextFn={() => setStage('names')} />}

                {stage === 'names' && (
                    <NamesStage backFn={() => setStage('receipt')} nextFn={() => setStage('items')} />
                )}

                {stage === 'items' && (
                    <ItemsStage backFn={() => setStage('names')} nextFn={() => setStage('results')} />
                )}

                {stage === 'results' && (
                    <ResultsStage backFn={() => setStage('items')} againFn={() => setStage('receipt')} />
                )}
            </main>
            <footer>
                <span>
                    <a className="link" href="https://github.com/vancomm/reckoner-app">
                        source code
                    </a>
                </span>
                <span>
                    {'made by '}
                    <a className="link" href="https://github.com/vancomm">
                        me
                    </a>
                </span>
                <span>{new Date(__BUILD_DATE__).getFullYear()}</span>
            </footer>
        </div>
    );
}
