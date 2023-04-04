// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'deno';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from './context.ts';
import { appRouter } from './router.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://127.0.0.1:5173',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, sb-access-token, sb-refresh-token, cookie',
};

export async function handler(request: Request) {
  // This is needed if you're planning to invoke your function from a browser.
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  const res = await fetchRequestHandler({
    endpoint: '/trpc',
    req: request,
    router: appRouter,
    createContext,
  });

  res.headers.set('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set(
    'Access-Control-Allow-Headers',
    'authorization, x-client-info, apikey, content-type, sb-access-token, sb-refresh-token, cookie'
  );
  return res;
}

serve(handler);

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
