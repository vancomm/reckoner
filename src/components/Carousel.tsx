import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CarouselContextInterface {
    activeChild?: string;
    setActiveChild: React.Dispatch<React.SetStateAction<string | undefined>>;
    items: string[];
    register: (id: string) => void;
}

const CarouselContext = React.createContext<CarouselContextInterface>(null!);

function CarouselContextProvider({ children }: { children: React.ReactNode }) {
    const [activeChild, setActiveChild] = React.useState<string>();
    const [items, setItems] = React.useState<string[]>([]);

    const register = React.useMemo(
        () => (id: string) =>
            setItems((state) =>
                state.includes(id)
                    ? state
                    : [...state, id].sort((a, b) => {
                          const tailNumberRegex = /\d+$/;
                          const endsInANumber = (str: string) => /\d+$/.test(str);
                          if (!endsInANumber(a)) return endsInANumber(b) ? -1 : 1;
                          if (!endsInANumber(b)) return 1;
                          const numA = a.match(tailNumberRegex)![0];
                          const numB = b.match(tailNumberRegex)![0];
                          return parseInt(numA) - parseInt(numB);
                      })
            ),
        []
    );

    const value: CarouselContextInterface = React.useMemo(
        () => ({
            items,
            register,
            activeChild,
            setActiveChild,
        }),
        [items, register, activeChild]
    );

    return <CarouselContext.Provider value={value}>{children}</CarouselContext.Provider>;
}

const useCarouselContext = () => React.useContext(CarouselContext);

export default function Carousel(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <CarouselContextProvider>
            <InnerCarousel {...props} />
        </CarouselContextProvider>
    );
}

function InnerCarousel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { items, setActiveChild } = useCarouselContext();

    React.useEffect(() => {
        setActiveChild(items[0]);
    }, [items, setActiveChild]);

    return (
        <div className={twMerge('relative flex flex-col items-center gap-2', className)} {...props}>
            {children}
            {items.length > 1 && <CarouselControls />}
        </div>
    );
}

function CarouselControls() {
    const { items, activeChild, setActiveChild } = useCarouselContext();

    const handlePrev = () => {
        setActiveChild((state) => {
            if (!state) return items[0];
            const index = items.indexOf(state) - 1;
            return index >= 0 ? items[index] : items[items.length - 1];
        });
    };

    const handleNext = () => {
        setActiveChild((state) => {
            if (!state) return items[0];
            const index = items.indexOf(state) + 1;
            return index < items.length ? items[index] : items[0];
        });
    };

    return (
        <>
            <div className="flex items-center justify-center gap-2">
                <button className="cursor-pointer text-white/70" onClick={handlePrev}>
                    {'<'}
                </button>
                <span>
                    {activeChild ? items.indexOf(activeChild) + 1 : '-'}
                    {' / '}
                    {items.length || '-'}
                </span>
                <button className="cursor-pointer text-white/70" onClick={handleNext}>
                    {'>'}
                </button>
            </div>
            <div className="absolute top-0 left-0 grid h-full w-[20%] cursor-pointer" onClick={handlePrev} />
            <div className="absolute top-0 right-0 grid h-full w-[20%] cursor-pointer" onClick={handleNext} />
        </>
    );
}

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
}

function CarouselItem({ id, className, ...props }: ItemProps) {
    const { register, activeChild } = useCarouselContext();

    React.useEffect(() => {
        register(id);
    }, [register, id]);

    return (
        <div className={twMerge('carousel-item hidden w-full', id === activeChild && 'block', className)} {...props} />
    );
}

Carousel.Item = CarouselItem;
