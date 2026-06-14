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
 * Gracefully handle auth failures so they don't pollute the console.
 * We intentionally do NOT auto-redirect to /login here — feature-specific
 * callers (e.g. handleSave) decide the right UX (modal, toast, etc.)
 * via their own try/catch around the mutation.
 *
 * Apollo Client v4 passes a combined `error` object instead of the
 * separate graphQLErrors / networkError from v3.
 */
const errorLink = onError(({ error }) => {
  // Silent: rely on caller to handle. We only normalize the detection here
  // for future hook-in (analytics, telemetry) without changing the call path.
  const message = String((error as Error)?.message || "");
  if (/unauthorized|UNAUTHENTICATED/i.test(message)) {
    // Intentionally no-op; let the mutation's catch block surface UX.
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
