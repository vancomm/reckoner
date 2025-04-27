import cn from 'classnames';
import { useState } from 'react';

import styles from './Select.module.css';

export default function Select() {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div>
            <button onClick={() => setCollapsed((state) => !state)}>{collapsed ? '+' : '-'}</button>
            <div className={cn(styles.select, { [styles.collapsed]: collapsed })}></div>
        </div>
    );
}
