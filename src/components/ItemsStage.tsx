import cn from 'classnames';
import { useState } from 'react';

import { InputRecord, useAppState } from '../contexts/AppStateContext';
import { UniqueItem } from '../lib/parseReceiptDocument';
import Button from './Button';
import Card, { CardActions, CardContainer } from './Card';
import Fraction from './Fraction';
import styles from './ItemsStage.module.css';
import StageContainer from './StageContainer';
import Toggle from './Toggle';

interface ItemContainerProps {
    item: UniqueItem;
}

function ItemContainer({ item }: ItemContainerProps) {
    const {
        names,
        setInputRecords,
        inputRecordsInterface: { getRecord, getRecords, getShares },
    } = useAppState();

    const { index, name, price, quantity, sum } = item;

    const [isPrecise, setPrecise] = useState(false);

    const isCardFilled = getRecords({ item }).some((r) => r.share > 0);

    const shares = getShares(item);

    const onPreciseToggle = () => {
        setPrecise((state) => !state);
    };

    const handleNameClick = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;

        const next: InputRecord = { item, name, share: checked ? 1 : 0 };

        setInputRecords((state) => {
            const prev = state.find((r) => r.item === item && r.name === name);
            return prev ? state.map((r) => (r === prev ? next : r)) : [...state, next];
        });
    };

    const isNameChecked = (name: string) => {
        const share = getRecord({ item, name })?.share ?? 0;
        return share > 0;
    };

    const handleInvertClick = () => {
        setInputRecords((state) => {
            const prev = state.filter((r) => r.item === item);
            const next = names.map((name) => {
                const prevShare = prev.find((r) => r.name === name)?.share ?? 0;
                return {
                    item,
                    name,
                    share: 1 - prevShare,
                };
            });
            return state.filter((r) => r.item !== item).concat(next);
        });
    };

    const handleAllClick = () => {
        setInputRecords((state) => {
            const prev = state.filter((r) => r.item === item);
            const next =
                prev.length === names.length && prev.every((r) => r.share === 1)
                    ? prev.map((r) => ({ ...r, share: 0 }))
                    : names.map((name) => ({ item, name, share: 1 }));
            return state.filter((r) => r.item !== item).concat(next);
        });
    };

    const handleShareIncrement = (name: string) => {
        setInputRecords((state) => {
            const prev = state.find((r) => r.item === item && r.name === name);
            const next = { item, name, share: (prev?.share || 0) + 1 };
            return prev ? state.map((r) => (r === prev ? next : r)) : [...state, next];
        });
    };

    const handleShareDecrement = (name: string) => {
        setInputRecords((state) => {
            const prev = state.find((r) => r.item === item && r.name === name);
            const next = { item, name, share: (prev?.share || 1) - 1 };
            return prev ? state.map((r) => (r === prev ? next : r)) : [...state, next];
        });
    };

    const getShare = (name: string) => getRecord({ item, name })?.share ?? 0;

    return (
        <CardContainer
            className={cn(styles.itemContainer, {
                [styles.success]: isCardFilled,
            })}
        >
            <Card id={`item-${index}`} className={styles.itemCard}>
                <Card.Title className={styles.itemTitle}>
                    {name.toLowerCase()}

                    <Card.Subtitle className={styles.itemSubtitle}>
                        {quantity > 1 ? (
                            <>
                                {sum / 100} <i>(= {`${price / 100} × ${quantity}`})</i>
                            </>
                        ) : (
                            price / 100
                        )}
                    </Card.Subtitle>
                </Card.Title>

                <div
                    className={cn(styles.namePickerContainer, {
                        [styles.isPrecise]: isPrecise,
                    })}
                >
                    {names.map((name, i) =>
                        isPrecise ? (
                            <div key={`item-${index}-name-${i}`} className={styles.preciseShareInputContainer}>
                                <div
                                    className={cn(styles.preciseShareInput, {
                                        [styles.checked]: isNameChecked(name),
                                    })}
                                >
                                    <Button
                                        disabled={(getRecord({ item, name })?.share ?? 0) === 0}
                                        onClick={() => handleShareDecrement(name)}
                                    >
                                        -
                                    </Button>

                                    <div>{name}</div>

                                    <Button onClick={() => handleShareIncrement(name)}>+</Button>
                                </div>
                                {getShare(name) > 0 && (
                                    <Fraction
                                        className={styles.share}
                                        numerator={getShare(name)}
                                        denominator={shares}
                                    />
                                )}
                            </div>
                        ) : (
                            <Toggle
                                id={`item-${index}-input-${name}`}
                                className={styles.namePicker}
                                label={name}
                                active={isNameChecked(name)}
                                onClick={handleNameClick(name)}
                            />
                        )
                    )}
                </div>
            </Card>

            <CardActions className={styles.itemCardActions}>
                <div>
                    <Button className={styles.itemCardAction} label="invert" onClick={handleInvertClick} />
                    <Button className={styles.itemCardAction} label="all" onClick={handleAllClick} />
                </div>
                <Toggle
                    id={`item-${index}-toggle`}
                    className={styles.itemCardToggle}
                    label={'precise'}
                    active={isPrecise}
                    onClick={onPreciseToggle}
                />
            </CardActions>
        </CardContainer>
    );
}

interface ItemsStageProps {
    backFn: () => void;
    nextFn: () => void;
}

export default function ItemsStage({ backFn, nextFn }: ItemsStageProps) {
    const { receiptData, inputRecords } = useAppState();

    if (!receiptData) return null;

    const items = receiptData.items;

    const nextCondition = items.every((item) => inputRecords.some((r) => r.item === item && r.share > 0));

    return (
        <StageContainer
            className={styles.itemsContainer}
            handleBack={() => {
                backFn();
            }}
            handleNext={() => {
                nextFn();
            }}
            nextCondition={nextCondition}
        >
            <StageContainer.Title>Items</StageContainer.Title>

            <div className={styles.items}>
                {items.map((item) => (
                    <ItemContainer key={`item-${item.index}`} item={item} />
                ))}
            </div>
        </StageContainer>
    );
}
