'use client';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createClient } from '../supabase/client';

const httpLink = createHttpLink({
  // Fallback to localhost:3001 if backend runs there
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:3001/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

/**
 * Gracefully handle auth failures so they don't pollute the console
 * and so we can route the user to the login screen instead of
 * leaving them on a broken mutation.
 *
 * Apollo Client v4 passes a combined `error` object instead of the
 * separate graphQLErrors / networkError from v3.
 */
const errorLink = onError(({ error, operation }) => {
  const message = String((error as Error)?.message || "");
  const cause = (error as { cause?: unknown })?.cause;
  const causeMessage =
    cause instanceof Error
      ? String(cause.message || "")
      : String(cause || "");

  const isAuthError =
    /unauthorized|UNAUTHENTICATED|jwt|token/i.test(message) ||
    /unauthorized|UNAUTHENTICATED|jwt|401|403/i.test(causeMessage) ||
    (() => {
      try {
        const raw = JSON.stringify(error);
        return /unauthorized|UNAUTHENTICATED/i.test(raw);
      } catch {
        return false;
      }
    })();

  if (isAuthError && typeof window !== 'undefined') {
    const path = window.location.pathname;
    const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');
    if (!isAuthRoute) {
      // Soft redirect only for state-mutating ops, not background prefetches.
      const isMutation = operation.query.definitions.some(
        (d) => d.kind === 'OperationDefinition' && d.operation === 'mutation'
      );
      if (isMutation) {
        const supabase = createClient();
        supabase.auth.signOut().finally(() => {
          window.location.href = '/login?reason=unauthorized';
        });
      }
    }
  }
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getStories: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          getStory: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-first', errorPolicy: 'all' },
    query: { fetchPolicy: 'cache-first', errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' },
  },
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
