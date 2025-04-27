import React, { useRef, useState } from 'react';

import Card, { CardActions, CardContainer } from '../../components/Card';
import Collapsible from '../../components/Collapsible';
import Fraction from '../../components/Fraction';
import StageContainer from '../../components/StageContainer';
import { InputRecord, useAppState } from '../../contexts/AppStateContext';
import formatMoney from '../../lib/formatMoney';
import { UniqueItem } from '../../lib/parseReceiptDocument';
import styles from './ResultsStage.module.css';

interface TotalRecord extends InputRecord {
    shares: number;
}

interface TotalCardProps {
    name: string;
    records: TotalRecord[];
}

function TotalCard({ name, records }: TotalCardProps) {
    const [collapseDetails, setCollapseDetails] = useState(true);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <CardContainer>
            <Card className={styles.totalCard}>
                <Card.Title className={styles.title}>{name}</Card.Title>

                <div>
                    {records.length > 0 && (
                        <Collapsible open={!collapseDetails}>
                            <div ref={ref} className={styles.gridDetails}>
                                <div className={styles.gridTitle}>#</div>
                                <div className={styles.gridTitle}>Item</div>
                                <div className={styles.gridTitle}>Price</div>
                                <div className={styles.gridTitle}></div>
                                <div className={styles.gridTitle}></div>
                                <div className={styles.gridTitle}></div>
                                <div className={styles.gridTitle}>Sum</div>
                                {records.map(({ item, share, shares }, index) => (
                                    <React.Fragment key={`total-${name}-${index}`}>
                                        <div>{index + 1}</div>
                                        <div>
                                            <span>
                                                {item.name}{' '}
                                                {item.quantity > 1 && (
                                                    <span className={styles.itemQuantity}>({item.quantity})</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className={styles.number}>{formatMoney(item.sum)}</div>
                                        <div>×</div>
                                        <div className={styles.share}>
                                            {share === shares ? (
                                                item.quantity
                                            ) : (
                                                <Fraction numerator={share} denominator={shares} />
                                            )}
                                        </div>
                                        <div>=</div>
                                        <div className={styles.number}>{formatMoney(item.sum * (share / shares))}</div>
                                    </React.Fragment>
                                ))}
                                <div></div>
                            </div>
                        </Collapsible>
                    )}

                    <div className={styles.totalLine}>
                        <span>total:</span>
                        <span>
                            {formatMoney(
                                records.map((r) => r.item.sum * (r.share / r.shares)).reduce((sum, add) => sum + add, 0)
                            )}
                        </span>
                    </div>
                </div>
            </Card>
            {records.length > 0 && (
                <CardActions>
                    <CardActions.Button
                        label={collapseDetails ? 'expand' : 'collapse'}
                        onClick={() => setCollapseDetails((state) => !state)}
                    />
                </CardActions>
            )}
        </CardContainer>
    );
}

interface ResultsProps {
    backFn: () => void;
    againFn: () => void;
}

export default function ResultsStage({ backFn, againFn }: ResultsProps) {
    const { names, inputRecords } = useAppState();

    const itemSharesMap = inputRecords.reduce((acc, { item, share }) => {
        const prev = acc.get(item) ?? 0;
        acc.set(item, prev + share);
        return acc;
    }, new Map<UniqueItem, number>());

    const getTotalsByName = (name: string) =>
        inputRecords
            .filter((r) => r.name === name && r.share > 0)
            .reduce((acc, r) => {
                return [...acc, { ...r, shares: itemSharesMap.get(r.item) ?? r.share }];
            }, [] as TotalRecord[]);

    return (
        <StageContainer
            handleBack={() => {
                backFn();
            }}
            extraButtons={[
                {
                    onClick: againFn,
                    className: styles.again,
                    children: 'Again',
                },
            ]}
        >
            <StageContainer.Title>Results</StageContainer.Title>

            <div className={styles.totals}>
                {names.map((name, index) => (
                    <TotalCard key={`total-card-${index}`} name={name} records={getTotalsByName(name)} />
                ))}
            </div>
        </StageContainer>
    );
}
