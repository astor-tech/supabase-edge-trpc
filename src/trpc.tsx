import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

import { type AppRouter } from '../supabase/functions/trpc/router';
import { supabase } from './supabase';

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() =>
    api.createClient({
      links: [
        httpBatchLink<AppRouter>({
          url: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/trpc`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
          headers: async () => {
            const { data: session } = await supabase.auth.getSession();
            return {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'sb-access-token': session.session?.access_token,
              'sb-refresh-token': session.session?.refresh_token,
            };
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
};
