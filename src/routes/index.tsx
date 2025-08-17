import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { createFileRoute } from '@tanstack/react-router';

// import WelcomePopup from '@/components/WelcomePopup';
// import usePersistentState from '@/hooks/use-persistent-storage';
import App from '@/pages/app/App';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    // const [showHelp, setShowHelp] = usePersistentState('show-help', true);

    return (
        <div data-route="/" className="flex min-h-screen flex-col items-stretch text-white md:items-center">
            <div className="mb-48 flex flex-row-reverse md:w-xl">
                {/* <button onClick={() => {}} className="cursor-pointer"> */}
                <StarIcon sx={{ fontSize: '.65em' }} className="m-6 ml-auto rotate-12 text-amber-100/80 md:mr-0" />
                {/* </button> */}
                {/* <WelcomePopup className="mx-2 block sm:hidden" /> */}
            </div>
            <header className="mb-4 flex justify-start rounded-xl px-3 py-4 select-none md:w-xl md:px-1">
                <Logo />
            </header>

            <App />

            <div className="min-h-30 w-full grow shadow-xl/25" />
            <Footer />
        </div>
    );
}

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

function Footer() {
    return (
        <footer className="flex w-full gap-x-1 bg-black/50 py-3 pl-2 text-center text-sm">
            <a className="flex items-center gap-x-[.1em]" href="https://github.com/vancomm">
                <GitHubIcon sx={{ fontSize: '1em', translate: '0 -.05em' }} />
                <span className="underline">vancomm</span>
            </a>
            <span>·</span>
            {new Date(__BUILD_DATE__).getFullYear()}
        </footer>
    );
}
