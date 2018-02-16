import * as React from 'react';
import cc from 'classcat';

import * as classes from './MessageWithIcon.module.css';

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  button?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const MessageWithIcon = ({
  title,
  icon,
  description,
  button,
  children,
  className,
  ...rest
}: Props) => (
  <div
    className={cc([
      className,
      {
        [classes.root]: true,
        [classes.hasDescription]: typeof description === 'string',
      },
    ])}
    {...rest}
  >
    <div className={classes.icon}>{icon}</div>
    <div className={classes.title}>{title}</div>
    {description ? (
      <div className={classes.description}>
        {description}
        {children}
      </div>
    ) : null}
    <div className={classes.buttonWrapper}>{button}</div>
  </div>
);
