import * as React from 'react';
import cc from 'classcat';
import * as classes from './Button.module.css';
import { Link, LinkProps } from 'react-router-dom';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className, ...rest }: ButtonProps) => (
  <button className={cc([classes.root, className])} {...rest} />
);

export type LinkButtonProps = LinkProps;

export const LinkButton = ({ className, ...rest }: LinkButtonProps) => (
  <Link className={cc([classes.root, className])} {...rest} />
);
