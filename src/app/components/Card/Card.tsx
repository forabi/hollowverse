import * as React from 'react';
import cc from 'classcat';
import * as classes from './Card.module.css';

type Props = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className, ...rest }: Props) => (
  <div className={cc([classes.root, className])} {...rest}>
    {children}
  </div>
);
