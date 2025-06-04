import { createFileRoute } from '@tanstack/react-router';

import WelcomePopup from '@/components/WelcomePopup';
import App from '@/pages/app/App';

export const Route = createFileRoute('/')({
    component: Root,
});

function Root() {
    return (
        <div className="flex min-h-screen flex-col items-stretch justify-start gap-4 py-2 font-['Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif] text-white sm:items-center">
            <WelcomePopup className="mx-2 block sm:hidden" />
            <header className="mx-auto mt-10 mb-8 text-center select-none sm:mt-0 sm:mb-16 sm:flex sm:w-sm sm:items-baseline sm:gap-x-2 md:w-xl">
                <h1 className="mt-2 grid w-fit text-center font-mono text-4xl leading-8 font-bold text-white text-shadow-black text-shadow-sm sm:grid-flow-col sm:gap-x-2 sm:text-2xl sm:leading-5">
                    <div className="flex justify-between">
                        <div>s</div>
                        <div>p</div>
                        <div>l</div>
                        <div>i</div>
                        <div>t</div>
                    </div>
                    <div className="flex justify-between">
                        <div>c</div>
                        <div>h</div>
                        <div>e</div>
                        <div>c</div>
                        <div>k</div>
                    </div>
                    <div className="flex justify-around gap-x-0.5">
                        <div>o</div>
                        <div>n</div>
                        <div>l</div>
                        <div>i</div>
                        <div>n</div>
                        <div>e</div>
                    </div>
                </h1>
            </header>
            <main className="mx-2 flex grow flex-col gap-4 md:max-w-xl">
                <App />
            </main>
            <footer className="mt-64 flex justify-center gap-x-1 text-center text-sm">
                <a
                    className="underline decoration-white/60 hover:decoration-white"
                    href="https://github.com/vancomm/reckoner"
                >
                    source
                </a>
                <span>·</span>
                {new Date(__BUILD_DATE__).getFullYear()}
            </footer>
        </div>
    );
}
