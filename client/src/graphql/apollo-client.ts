import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getSession } from 'next-auth/react';

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include"
});

//window object is only available to us us when we are in browser. here we are doing this to only perform this action on client side and not server side so if window object is present that means we are on the client side

const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql/subscriptions',
  connectionParams: async () =>({
    session: await getSession(),
  })
})) : null

const splitLink = typeof window !== 'undefined' && wsLink != null ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
) : httpLink

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})