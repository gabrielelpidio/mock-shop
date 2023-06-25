import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  useQuery as useTanstackQuery,
  type UseQueryResult,
  useMutation as useTanstackMutation,
  type UseMutationResult,
  UseQueryOptions,
} from "@tanstack/react-query";
import client from "./isomorphicFetcher";

export function useQuery<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
  options: UseQueryOptions<TResult, unknown, TResult> = {}
): UseQueryResult<TResult> {
  return useTanstackQuery(
    [(document.definitions[0] as any).name.value, variables],
    async ({ queryKey }) =>
      client(document, queryKey[1] ? queryKey[1] : undefined)
  );
}

export function useMutation<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
  options: UseQueryOptions<TResult, unknown, TResult> = {}
): UseMutationResult<TResult, unknown, TVariables> {
  return useTanstackMutation(
    [(document.definitions[0] as any).name.value, variables],
    async (variables) => client(document, variables ? variables : undefined)
  );
}
