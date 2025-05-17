import { SVGProps } from 'react';

export function UnfoldMore(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
            <path
                fill="currentColor"
                d="m12 21l-4.5-4.5l1.45-1.45L12 18.1l3.05-3.05l1.45 1.45zM8.95 9.05L7.5 7.6L12 3.1l4.5 4.5l-1.45 1.45L12 6z"
            ></path>
        </svg>
    );
}
