import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLClient } from "graphql-request";

const GQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL!);

const client = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables
): Promise<TResult> => {
  return GQLClient.request(document, variables ?? undefined);
};

export default client;
