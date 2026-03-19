'use client';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
