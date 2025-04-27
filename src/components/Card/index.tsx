import cn from 'classnames';

import { Customizable } from '../../types/Customizable';
import { Nestable } from '../../types/Nestable';
import Button from '../Button';
import Toggle from '../Toggle';
import styles from './Card.module.css';

export interface CardProps extends Customizable, Nestable {}

export default function Card({ id, className, style, children }: CardProps) {
    return (
        <div id={id} className={cn(styles.card, className)} style={style}>
            {children}
        </div>
    );
}

function Title({ id, className, style, children }: CardProps) {
    return (
        <div id={id} className={cn(styles.cardTitle, className)} style={style}>
            {children}
        </div>
    );
}

Card.Title = Title;

function Subtitle({ id, className, style, children }: CardProps) {
    return (
        <div id={id} className={cn(styles.cardSubtitle, className)} style={style}>
            {children}
        </div>
    );
}

Card.Subtitle = Subtitle;

export function CardContainer({ id, className, style, children }: CardProps) {
    return (
        <div id={id} className={cn(styles.cardContainer, className)} style={style}>
            {children}
        </div>
    );
}

export function CardActions({ id, className, style, children }: CardProps) {
    return (
        <div id={id} className={cn(styles.cardActions, className)} style={style}>
            {children}
        </div>
    );
}

CardActions.Button = Button;

CardActions.Toggle = Toggle;
