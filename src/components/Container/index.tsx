import cn from 'classnames';

import { Customizable } from '../../types/Customizable';
import { Nestable } from '../../types/Nestable';
import styles from './Container.module.css';

interface ContainerProps extends Nestable, Customizable {}

export default function Container({ id, className, style, children }: ContainerProps) {
    return (
        <div id={id} className={cn(styles.container, className)} style={style}>
            {children}
        </div>
    );
}
