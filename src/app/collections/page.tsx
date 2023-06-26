import {
  ListingCard,
  ListingGrid,
  ListingPageNavigation,
} from "@/components/listing";
import { graphql } from "@/gql/gql";
import client from "@/lib/isomorphicFetcher";

const PAGE_SIZE = 6;

const ProductListingQuery = graphql(`
  query CollectionListingQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    collections(first: $first, last: $last, after: $after, before: $before) {
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
        image {
          id
          url
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
        Collections Listing Page
      </h1>

      <ListingGrid>
        {data.collections.nodes.map((collection) => (
          <ListingCard
            img={collection.image?.url}
            title={collection.title}
            href={`/products/${collection.handle}`}
            key={collection.handle}
          />
        ))}
      </ListingGrid>

      <hr className="w-full border-border" />

      <ListingPageNavigation
        afterHref={
          data.collections.pageInfo.hasNextPage
            ? `/collections?after=${data.collections.pageInfo.endCursor}`
            : null
        }
        beforeHref={
          data.collections.pageInfo.hasPreviousPage
            ? `/collections?before=${data.collections.pageInfo.startCursor}`
            : null
        }
      />
    </main>
  );
};

export default ProductListingPage;
