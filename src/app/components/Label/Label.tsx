import * as React from 'react';
import cc from 'classcat';

import * as classes from './Label.module.css';

type Props = {
  text: string;
  size?: 'small' | 'normal';
  className?: string;
};

export const Label = ({ text, size = 'normal', className }: Props) => (
  <div
    className={cc([
      className,
      classes.root,
      {
        [classes.small]: size === 'small',
      },
    ])}
  >
    {text}
  </div>
);
