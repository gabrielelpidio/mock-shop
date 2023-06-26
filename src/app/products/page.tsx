import {
  ListingCard,
  ListingGrid,
  ListingPageNavigation,
} from "@/components/listing";
import { graphql } from "@/gql/gql";
import client from "@/lib/isomorphicFetcher";

const PAGE_SIZE = 6;

/* The demo store doesn't have discounts or different variants, 
so for now we'll just use the min variant price. */

const ProductListingQuery = graphql(`
  query ProductListingQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    products(first: $first, last: $last, after: $after, before: $before) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        handle
        title
        description
        descriptionHtml
        featuredImage {
          id
          url
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`);

const ProductListingPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const data = await client(ProductListingQuery, {
    ...(typeof searchParams.after === "string"
      ? {
          after: searchParams.after,
          first: PAGE_SIZE,
        }
      : {}),
    ...(typeof searchParams.before === "string"
      ? {
          before: searchParams.before,
          last: PAGE_SIZE,
        }
      : {}),

    ...(typeof searchParams.before !== "string" &&
    typeof searchParams.after !== "string"
      ? {
          first: PAGE_SIZE,
        }
      : {}),
  });

  return (
    <main className="container py-2">
      <h1 className="text-accent-foreground text-2xl font-semibold">
        Product Listing Page
      </h1>

      <ListingGrid>
        {data.products.nodes.map((product) => (
          <ListingCard
            img={product.featuredImage?.url}
            title={product.title}
            href={`/products/${product.handle}`}
            amount={product.priceRange?.minVariantPrice.amount}
            currency={product.priceRange?.minVariantPrice.currencyCode}
            key={product.handle}
          />
        ))}
      </ListingGrid>

      <hr className="w-full border-border" />

      <ListingPageNavigation
        afterHref={`/products?after=${data.products.pageInfo.endCursor}`}
        beforeHref={`/products?before=${data.products.pageInfo.startCursor}`}
        hasPreviousPage={data.products.pageInfo.hasPreviousPage}
        hasNextPage={data.products.pageInfo.hasNextPage}
      />
    </main>
  );
};

export default ProductListingPage;
