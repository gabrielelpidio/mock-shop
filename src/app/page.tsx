import Link from "next/link";
import { graphql } from "@/gql";
import client from "@/lib/isomorphicFetcher";
import { ChevronRight } from "lucide-react";
import { PropsWithChildren } from "react";

const ProductQuery = graphql(`
  query Collections {
    collections(first: 6) {
      nodes {
        handle
        image {
          url
        }
        title
        description
        descriptionHtml
      }
    }
    products(first: 6) {
      nodes {
        handle
        title
        description
        descriptionHtml
        featuredImage {
          id
          url
        }
      }
    }
  }
`);

const ShowcaseListItem = ({
  href,
  image,
  title,
}: {
  href: string;
  image: string;
  title: string;
}) => (
  <li className="col-span-2 w-48 flex-shrink-0 flex-grow max-w-[]">
    <Link href={href} className="h-full block">
      <img src={image} className="rounded-md aspect-square" />
      <h2 className="text-xl">{title}</h2>
    </Link>
  </li>
);

const ShowcaseList = ({
  href,
  title,
  children,
}: PropsWithChildren<{ href: string; title: string }>) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center font-semibold text-muted-foreground">
      <Link href={href}>
        <h3 className="text-2xl">{title}</h3>
      </Link>

      <Link href={href} className="gap-1 flex items-center text-lg ">
        <span>See all</span>
        <ChevronRight />
      </Link>
    </div>
    <ul className="flex gap-4 overflow-auto pb-2">{children}</ul>
  </div>
);

export default async function Home() {
  const data = await client(ProductQuery);
  return (
    <main className="container">
      <div className="flex flex-col gap-12">
        <h1 className="text-4xl font-semibold">Welcome to your store</h1>
        <ShowcaseList href="/collections" title="Collections">
          {data?.collections?.nodes?.map((item) => (
            <ShowcaseListItem
              href={`/collection/${item?.handle}`}
              image={item?.image?.url}
              title={item?.title}
              key={item.handle}
            />
          ))}
        </ShowcaseList>
        <ShowcaseList href="/products" title="Products">
          {data?.products?.nodes?.map((item) => (
            <ShowcaseListItem
              href={`/products/${item?.handle}`}
              image={item?.featuredImage?.url}
              title={item?.title}
              key={item.handle}
            />
          ))}
        </ShowcaseList>
      </div>
    </main>
  );
}
