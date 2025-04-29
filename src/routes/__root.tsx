import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: Root,
});

function Root() {
    return (
        <div className="flex min-h-dvh flex-col items-stretch justify-start gap-4 py-2 font-['Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif] text-white sm:items-center">
            <header className="mx-4 mb-6">
                <h1 className="mt-2 w-fit text-center font-serif text-2xl font-bold">сплит-чек онлайн!</h1>
            </header>
            <main className="mx-2 flex grow flex-col gap-4 sm:mx-4">
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
