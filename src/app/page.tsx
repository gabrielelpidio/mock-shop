import Link from "next/link";
import { graphql } from "@/gql";
import client from "@/lib/isomorphicFetcher";

const ProductQuery = graphql(`
  query Collections($cursor: String) {
    collections(first: 6, after: $cursor) {
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
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
  }
`);

export default async function Home() {
  const data = await client(ProductQuery);
  return (
    <main className="container">
      <ul className="grid grid-cols-4 gap-4">
        {data?.collections?.nodes?.map((item) => (
          <>
            <li className="col-span-2 ">
              <Link
                href={`/collection/${item?.handle}`}
                className="h-full block"
              >
                <img
                  src={item?.image?.url}
                  className="rounded-md aspect-square"
                />
                <h2 className="text-2xl">{item?.title}</h2>
              </Link>
            </li>
          </>
        ))}
      </ul>
    </main>
  );
}
