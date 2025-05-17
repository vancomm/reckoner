import React from 'react';

export default function UnfoldLess(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
            <path
                fill="currentColor"
                d="m8.9 20l-1.4-1.4l4.5-4.5l4.5 4.5l-1.4 1.4l-3.1-3.1zM12 9.9L7.5 5.4L8.9 4L12 7.1L15.1 4l1.4 1.4z"
            ></path>
        </svg>
    );
}
