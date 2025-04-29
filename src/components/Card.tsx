import cn from 'classnames';
import React from 'react';

import Button from './Button';
import styles from './Card.module.css';
import Toggle from './Toggle';

export default function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(styles.card, className)} {...props} />;
}

function Title({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(styles.cardTitle, className)} {...props} />;
}

Card.Title = Title;

function Subtitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(styles.cardSubtitle, className)} {...props} />;
}

Card.Subtitle = Subtitle;

export function CardContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(styles.cardContainer, className)} {...props} />;
}

export function CardActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(styles.cardActions, className)} {...props} />;
}

CardActions.Button = Button;

CardActions.Toggle = Toggle;
