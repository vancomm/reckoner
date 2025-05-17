import { Outlet, createRootRoute } from '@tanstack/react-router';

import WelcomePopup from '@/components/WelcomePopup';

export const Route = createRootRoute({
    component: Root,
});

function Root() {
    return (
        <div className="flex min-h-dvh flex-col items-stretch justify-start gap-4 py-2 font-['Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif] text-white sm:items-center">
            <WelcomePopup className="mx-2 block sm:hidden" />
            <header className="mx-auto mt-10 mb-8 text-center sm:mt-0 sm:flex sm:items-baseline sm:gap-x-2">
                <h1 className="mt-2 grid w-fit text-center font-mono text-4xl leading-8 font-bold text-white text-shadow-black text-shadow-sm sm:text-xl sm:leading-4">
                    <div className="flex justify-around">
                        <div>s</div>
                        <div>p</div>
                        <div>l</div>
                        <div>i</div>
                        <div>t</div>
                    </div>
                    <div className="flex justify-around">
                        <div>c</div>
                        <div>h</div>
                        <div>e</div>
                        <div>c</div>
                        <div>k</div>
                    </div>
                    <div className="flex justify-around">
                        <div>o</div>
                        <div>n</div>
                        <div>l</div>
                        <div>i</div>
                        <div>ne</div>
                    </div>
                </h1>
            </header>
            <main className="mx-2 flex grow flex-col gap-4">
                <Outlet />
            </main>
            <footer className="mt-30 text-center text-sm">
                <a className="underline" href="https://github.com/vancomm">
                    made by me
                </a>
                {` in ${new Date(__BUILD_DATE__).getFullYear()}`}
            </footer>
        </div>
    );
}
