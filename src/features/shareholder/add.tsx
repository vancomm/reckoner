import FocusableOnMountInput from '@/components/FocusableOnMountInput';
import { Shareholder } from '@/lib/shareholder';

interface NewShareholderInputProps {
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
}

export default function NewShareholderInput({ setShareholders }: NewShareholderInputProps) {
    return (
        <label htmlFor="new-shareholder-input" className="flex cursor-pointer items-center overflow-clip rounded-lg border-transparent bg-black/30">
            <div className="pr-1 pl-2 text-xl">+</div>
            <FocusableOnMountInput
                id="new-shareholder-input"
                focusOnMount={true}
                placeholder="Добавить..."
                className="h-9 pr-1"
                onKeyDown={(e) => {
                    const target = e.target as EventTarget & HTMLInputElement;
                    const { value } = target;
                    if (e.key === 'Escape') {
                        target.value = '';
                        target.blur();
                    } else if (e.key === 'Enter') {
                        if (value.length > 0) {
                            setShareholders((shareholders) => shareholders.concat({ id: crypto.randomUUID(), name: value }));
                            target.value = '';
                        }
                    }
                }}
                onBlur={(e) => {
                    e.target.value = '';
                }}
            />
        </label>
    );
}
