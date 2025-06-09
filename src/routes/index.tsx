import { createFileRoute } from '@tanstack/react-router';

// import WelcomePopup from '@/components/WelcomePopup';
import App from '@/pages/app/App';

export const Route = createFileRoute('/')({
    component: Root,
});

function Logo() {
    return (
        <h1 className="grid w-fit grid-flow-col gap-x-2 text-center font-mono text-xl leading-4 font-bold text-white text-shadow-black text-shadow-sm sm:text-2xl">
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
            <div className="flex justify-around gap-x-[0.01em]">
                <div>o</div>
                <div>n</div>
                <div>l</div>
                <div>i</div>
                <div>n</div>
                <div>e</div>
            </div>
        </h1>
    );
}

function Root() {
    return (
        <div className="flex min-h-screen flex-col items-stretch justify-start gap-4 py-2 font-['Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif] text-white sm:items-center">
            <header className="mt-48 flex justify-start rounded-xl px-3 py-4 select-none sm:mt-[400px] sm:flex sm:w-sm sm:items-baseline sm:gap-x-2 md:w-xl md:px-1">
                <Logo />
            </header>
            {/* <WelcomePopup className="mx-2 block sm:hidden" /> */}

            <App />

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
