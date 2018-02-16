import * as React from 'react';
import cc from 'classcat';
import * as classes from './Square.module.css';

/**
 * A responsive container that maintains its 1:1 aspect ratio
 * regardless of its implicit/explicit width, works with flex containers.
 */
export const Square = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cc([classes.root, className])} {...rest}>
    <div className={classes.content}>{children}</div>
  </div>
);
