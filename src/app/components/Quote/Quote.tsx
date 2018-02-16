import * as React from 'react';
import cc from 'classcat';

import * as classes from './Quote.module.css';

type Props = React.BlockquoteHTMLAttributes<HTMLElement> & {
  size?: 'normal' | 'large';
};

export const Quote = ({ className, size = 'normal', ...rest }: Props) => (
  <blockquote
    className={cc([
      className,
      classes.root,
      { [classes.large]: size === 'large' },
    ])}
    {...rest}
  />
);
