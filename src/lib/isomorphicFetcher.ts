import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLClient } from "graphql-request";

const API_URL = "https://mock.shop/api";

const { request } = new GraphQLClient(API_URL);

const client = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables
): Promise<TResult> => {
  return request(document, variables ?? undefined);
};

export default client;
