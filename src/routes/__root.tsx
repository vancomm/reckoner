import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: Root,
});

function Root() {
    return (
        <div className="app flex min-h-dvh flex-col items-stretch justify-start gap-4 py-2 sm:items-center">
            <header className="mx-4 mb-6">
                <h1 className="mt-2 w-fit text-center font-serif text-2xl font-bold">сплит-чек онлайн!</h1>
            </header>
            <main className="mx-4 flex grow flex-col gap-4 sm:mx-4">
                <Outlet />
            </main>
            <footer className="text-center text-sm">
                <a className="underline" href="https://github.com/vancomm">
                    made by me
                </a>
                {` in ${new Date(__BUILD_DATE__).getFullYear()}`}
            </footer>
        </div>
    );
}
