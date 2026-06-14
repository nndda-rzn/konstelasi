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
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  const isAuthError =
    graphQLErrors?.some(
      (e) =>
        /unauthorized/i.test(e.message) ||
        (e.extensions as { code?: string } | undefined)?.code === 'UNAUTHENTICATED'
    ) ||
    (networkError && /401|403/.test(String(networkError)));

  if (isAuthError && typeof window !== 'undefined') {
    // Suppress the noisy Apollo default log; the mutation caller
    // will receive the error and the UI can react accordingly.
    const path = window.location.pathname;
    const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');
    if (!isAuthRoute) {
      // Soft redirect to login only for state-mutating ops, not prefetches.
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
