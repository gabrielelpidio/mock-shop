import { cn } from "@/lib/utils";
import * as React from "react";

const priceFormatter = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  });

  return formatter.format(amount);
};

const Price = ({
  amount,
  currency,
  className,
  ...args
}: React.HTMLAttributes<HTMLSpanElement> & {
  currency: string;
  amount: number;
}) => {
  return (
    <span className={cn("font-semibold", className)} {...args}>
      {priceFormatter(amount, currency)}
    </span>
  );
};

export default Price;
