import cn from 'classnames';
import { useState } from 'react';

import Button from '../../components/Button';
import Card, { CardActions, CardContainer } from '../../components/Card';
import Fraction from '../../components/Fraction';
import StageContainer from '../../components/StageContainer';
import Toggle from '../../components/Toggle';
import { InputRecord, useAppState } from '../../contexts/AppStateContext';
import { UniqueItem } from '../../utils/parseReceiptDocument';
import styles from './ItemsStage.module.css';

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

// function mergeItems(items: UniqueItem[]): UniqueItem[] {
//   return items.slice().reduce((acc, curr) => {
//     const index = acc.findIndex((i) => i.name === curr.name);
//     if (index === -1) return [...acc, curr];
//     const prev = acc[index];
//     const next: UniqueItem = {
//       ...prev,
//       quantity: prev.quantity + curr.quantity,
//       sum: prev.sum + curr.sum,
//     };
//     return acc.map((v, i) => (i === index ? next : v));
//   }, [] as UniqueItem[]);
// }

// function spreadItems(items: UniqueItem[]): UniqueItem[] {
//   let offset = 0;
//   return items.reduce((acc, item, index) => {
//     if (item.quantity === 1 || !Number.isInteger(item.quantity)) {
//       const reindexed = { ...item, index: index + offset };
//       return [...acc, reindexed];
//     }
//     const duplicates: UniqueItem[] = range(item.quantity).map((i) => ({
//       ...item,
//       index: index + offset + i,
//       quantity: 1,
//       sum: item.price,
//     }));
//     offset += item.quantity - 1;
//     return [...acc, ...duplicates];
//   }, [] as UniqueItem[]);
// }

// const mergeOptions = ["none", "merge", "spread"] as const;

// type MergeOption = typeof mergeOptions[number];

// function getMergeFunc(
//   option: MergeOption
// ): (items: UniqueItem[]) => UniqueItem[] {
//   switch (option) {
//     case "none":
//       return (items) => items;
//     case "merge":
//       return mergeItems;
//     case "spread":
//       return spreadItems;
//   }
// }

interface ItemsStageProps {
    backFn: () => void;
    nextFn: () => void;
}

export default function ItemsStage({ backFn, nextFn }: ItemsStageProps) {
    const { receiptData, inputRecords } = useAppState();

    // const [merge, setMerge] = useState<MergeOption>("none");

    if (!receiptData) return null;

    // const items = getMergeFunc(merge)(receiptData.items);
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

            {/* {false && (
        <Card className={styles.optionsCard}>
          <Card.Title className={styles.optionsTitle}>Options</Card.Title>
          <div className={styles.optionsToggles}>
            <div className={styles.optionRow}>
              <Toggle
                id="merge-toggle"
                active={merge !== "none"}
                label={merge}
                onClick={() =>
                  setMerge((state) =>
                    state === "none"
                      ? "merge"
                      : state === "merge"
                      ? "spread"
                      : "none"
                  )
                }
              />
            </div>
          </div>
        </Card>
      )} */}

            <div className={styles.items}>
                {items.map((item) => (
                    <ItemContainer key={`item-${item.index}`} item={item} />
                ))}
            </div>
        </StageContainer>
    );
}
