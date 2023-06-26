import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  useQuery as useTanstackQuery,
  type UseQueryResult,
  useMutation as useTanstackMutation,
  type UseMutationResult,
} from "@tanstack/react-query";
import client from "./isomorphicFetcher";

/* Implementation could be improved to accommodate all the 
options from react-query by either implementing it manually 
or trough a codegen process */

export function useQuery<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables
): UseQueryResult<TResult> {
  return useTanstackQuery(
    [(document.definitions[0] as any).name.value, variables],
    async ({ queryKey }) =>
      client(document, queryKey[1] ? queryKey[1] : undefined)
  );
}

export function useMutation<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables
): UseMutationResult<TResult, unknown, TVariables> {
  return useTanstackMutation(
    [(document.definitions[0] as any).name.value, variables],
    async (variables) => client(document, variables ? variables : undefined)
  );
}
