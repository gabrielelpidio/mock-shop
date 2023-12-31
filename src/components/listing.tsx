import Link from "next/link";
import * as React from "react";
import Price from "./price";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export const ListingCard = ({
  href,
  img,
  title,
  currency,
  amount,
}: {
  href: string;
  img: string;
  title: string;
  currency?: string;
  amount?: number;
}) => {
  return (
    <li>
      <Link
        href={href}
        className="col-span-1 flex flex-col gap-2 border-border border rounded-md pb-2 bg-accent"
      >
        <div className="rounded-md rounded-b-none overflow-hidden aspect-square">
          <img src={img} alt="" />
        </div>
        <div className="flex items-start justify-between px-2 flex-col">
          <h2 className="text-xl font-semibold text-ellipsis whitespace-nowrap w-full overflow-hidden">
            {title}
          </h2>

          {currency && amount && (
            <Price
              className="text-accent-foreground flex-grow"
              currency={currency}
              amount={amount}
            />
          )}
        </div>
      </Link>
    </li>
  );
};

export const ListingGrid = ({
  children,
  className,
}: React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>>) => {
  return (
    <ul className={cn("grid grid-cols-2 lg:grid-cols-3 gap-4 py-4", className)}>
      {children}
    </ul>
  );
};

export const ListingPageNavigation = ({
  beforeHref,
  afterHref,
}: {
  beforeHref?: string | null;
  afterHref?: string | null;
}) => {
  return (
    <div className="py-4 gap-2 flex w-full justify-end">
      <Button
        asChild={Boolean(beforeHref)}
        variant="outline"
        disabled={!beforeHref}
      >
        <Link href={beforeHref ?? "#"}>Previous page</Link>
      </Button>
      <Button
        asChild={Boolean(afterHref)}
        variant="outline"
        disabled={!afterHref}
      >
        <Link href={afterHref ?? "#"}>Next Page</Link>
      </Button>
    </div>
  );
};
