import React from 'react';
import Markdown from 'react-markdown';
import { twMerge } from 'tailwind-merge';

import Carousel from '@/components/Carousel';
import Close from '@/components/Close';
import idbCache from '@/lib/idbCache';

const manualSources = ['./md/1.md', './md/2.md', './md/3.md', './md/4.md'] as const;

export default function WelcomePopup() {
    const [pages, setPages] = React.useState<string[]>([]);
    const [hidden, setHidden] = React.useState(false);
    const [folded, setFolded] = React.useState(true);

    React.useEffect(() => {
        idbCache.get('hideWelcomeMessage').then((r) => {
            r.match(
                (v) => setHidden(v),
                () => {
                    idbCache.set('hideWelcomeMessage', false);
                }
            );
        });
    }, []);

    React.useEffect(() => {
        if (manualSources) {
            Promise.all(
                manualSources.map((url) =>
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
        !hidden &&
        pages && (
            <div className="relative sm:w-sm md:w-xl">
                <div
                    className={twMerge(
                        'flex flex-col items-center gap-4 rounded-2xl bg-black/30 p-4 text-white sm:items-stretch',
                        folded && 'h-48 cursor-default overflow-clip mask-b-from-50% mask-b-to-80%'
                    )}
                >
                    <div className="flex w-full justify-between">
                        <button
                            className="inline text-sm underline opacity-50"
                            onClick={() => {
                                setHidden(true);
                                idbCache.set('hideWelcomeMessage', false);
                            }}
                        >
                            больше не показывать
                        </button>
                        <button className="opacity-70" onClick={() => setHidden(true)}>
                            <Close className="h-4 w-4 cursor-pointer fill-white" />
                        </button>
                    </div>
                    <Carousel
                        className={twMerge(folded && 'cursor-pointer')}
                        onClick={() => {
                            if (folded) {
                                setFolded(false);
                            }
                        }}
                    >
                        {pages.map((page, i) => (
                            <Carousel.Item
                                key={`carousel-item-${i}`}
                                id={`carousel-item-${i}`}
                                className="prose prose-sm dark:prose-invert leading-5"
                            >
                                <Markdown>{page}</Markdown>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                {folded && (
                    <button
                        className="absolute bottom-4 left-1/2 z-50 inline-block -translate-x-1/2 cursor-pointer rounded-md bg-[rgba(0,_0,_0,_.3)] p-1 px-2 text-sm font-semibold hover:bg-[rgba(0,_0,_0,_.4)]"
                        onClick={() => setFolded(false)}
                    >
                        Читать полностью
                    </button>
                )}
            </div>
        )
    );
}
