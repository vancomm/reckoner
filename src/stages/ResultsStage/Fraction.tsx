import styles from './ResultsStage.module.css';

interface FractionProps {
    numerator: number;
    denominator: number;
}
export function Fraction({ numerator, denominator }: FractionProps) {
    // const isSupported = (num: number, den: number) => {
    //   if (
    //     !Number.isInteger(num) ||
    //     !Number.isInteger(den) ||
    //     num < 1 ||
    //     num > 7 ||
    //     den < 2 ||
    //     den > 10 ||
    //     num >= den
    //   )
    //     return false;
    //   if (num === 1) return true; // all valid dens have a num == 1
    //   if (den === 7 || den >= 9) return false; // dens 7, 9, 10 only have a num == 1
    //   if (den < 6) return true; // dens below 6 have all remaining nums
    //   if (den === 6 && num === 5) return true;
    //   if (den === 8 && num % 2 === 0) return true;
    //   return false;
    // };
    return (
        <span className={styles.fraction}>
            <sup>{numerator}</sup>&frasl;<sub>{denominator}</sub>
        </span>
    );
}
