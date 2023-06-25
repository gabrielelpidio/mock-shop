"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Search, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HTMLAttributes, PropsWithChildren, useEffect, useState } from "react";
import { CommandLoading } from "cmdk";
import { graphql } from "@/gql";
import { useQuery } from "@/lib/gql-hooks";
import { cn } from "@/lib/utils";
import { Avatar } from "./ui/avatar";

const SearchQuery = graphql(`
  query Search($query: String) {
    products(query: $query, first: 5) {
      nodes {
        title
        handle
        description
        descriptionHtml
        featuredImage {
          id
          url
        }
      }
    }
    collections(query: $query, first: 5) {
      nodes {
        title
        handle
        description
        descriptionHtml
        image {
          url
        }
      }
    }
  }
`);

const EmptyResult = ({
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div cmdk-empty="" className={cn("py-6 text-center text-sm", className)}>
    {children}
  </div>
);

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 100);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SearchButton = () => {
  const [input, setInput] = useState("");

  const debouncedInput = useDebounce(input, 200);

  const { data, isLoading } = useQuery(
    SearchQuery,
    {
      query: debouncedInput,
    },
    {}
  );

  const noResults =
    !isLoading &&
    data?.products?.nodes.length === 0 &&
    data?.collections?.nodes.length === 0;

  return (
    <Dialog onOpenChange={(open) => !open && setInput("")}>
      <DialogTrigger asChild>
        <Button className="gap-2 flex items-center" variant="outline">
          Search
          <Search size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 translate-y-0 top-0 max-w-full">
        <Command className="container w-full" shouldFilter={false}>
          <CommandInput
            placeholder="Search a product or collection..."
            onValueChange={(v) => {
              setInput(v);
            }}
          />

          <CommandList className="sm:max-h-[40vh] max-h-[calc(100vh-45px)] overflow-auto">
            {isLoading && (
              <CommandLoading>
                <div className="flex gap-2 text-center justify-center py-6 w-full">
                  Loading <Loader2 className="animate-spin"></Loader2>
                </div>
              </CommandLoading>
            )}
            <EmptyResult className={cn("hidden", noResults && "block")}>
              No results found for <strong>{input}</strong>
            </EmptyResult>
            <div
              className={cn(
                "sm:grid grid-cols-12 flex flex-col",
                (isLoading || noResults) && "hidden sm:hidden"
              )}
            >
              <CommandGroup
                heading="Collections"
                className="sm:col-span-4 relative sm:max-h-[calc(40vh-0.5rem)] overflow-auto pb-3"
              >
                {data?.collections?.nodes?.length === 0 && (
                  <EmptyResult>
                    No collections found for <strong>{input}</strong>
                  </EmptyResult>
                )}
                <div className="flex flex-row sm:flex-col">
                  {data?.collections?.nodes?.map((collection) => (
                    <CommandItem
                      key={collection.handle}
                      className="gap-2 flex-col sm:flex-row"
                    >
                      <div className="h-12 w-12 rounded-sm overflow-hidden">
                        <img
                          src={collection.image?.url}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-ellipsis">{collection.title}</span>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>

              <CommandGroup
                heading="Products"
                className="sm:col-span-8 row-start-1 [&>[cmdk-group-items]]:flex-grow sm:row-start-auto min-h-full justify-between flex flex-col"
              >
                <div className="sm:flex w-full h-full gap-1 overflow-auto pb-2 grid grid-cols-2">
                  {data?.products?.nodes?.length === 0 && (
                    <EmptyResult className="col-span-full">
                      No products found for <strong>{input}</strong>
                    </EmptyResult>
                  )}
                  {data?.products?.nodes?.map((product) => (
                    <CommandItem
                      key={product.handle}
                      className="flex flex-col transition-colors"
                    >
                      <div className="rounded-sm sm:w-48 sm:h-48">
                        <img src={product.featuredImage?.url} alt="" />
                      </div>
                      <div className="flex items-center h-full">
                        {product.title}
                      </div>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchButton;
