// src/components/landing/carousel-buttons.tsx
import React, { PropsWithChildren } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ButtonProps = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>;

export const PrevButton: React.FC<ButtonProps> = (props) => {
  const { children, ...restProps } = props;
  return (
    <button
      className="embla__button embla__button--prev p-2 rounded-full bg-background/50 border border-border/30 shadow-md hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      {...restProps}
    >
      <ChevronLeft className="h-5 w-5" />
      {children}
    </button>
  );
};

export const NextButton: React.FC<ButtonProps> = (props) => {
  const { children, ...restProps } = props;
  return (
    <button
      className="embla__button embla__button--next p-2 rounded-full bg-background/50 border border-border/30 shadow-md hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      {...restProps}
    >
      <ChevronRight className="h-5 w-5" />
      {children}
    </button>
  );
};

export const DotButton: React.FC<ButtonProps> = (props) => {
  const { children, ...restProps } = props;
  return (
    <button
      className="embla__dot w-2.5 h-2.5 rounded-full bg-muted-foreground/40 hover:bg-primary transition-colors"
      type="button"
      {...restProps}
    >
      {children}
    </button>
  );
};