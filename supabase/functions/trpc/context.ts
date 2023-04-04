import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import {
  createServerSupabaseClient,
  parseCookies,
  serializeCookie,
} from '@supabase/auth-helpers-shared';

export async function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  const access_token = req.headers.get('sb-access-token') || '';
  const refresh_token = req.headers.get('sb-refresh-token') || '';

  const supabase = createServerSupabaseClient({
    supabaseUrl: Deno.env.get('SUPABASE_URL') || '',
    supabaseKey: Deno.env.get('SUPABASE_ANON_KEY') || '',
    // @ts-ignore CDN does not provide proper types
    setCookie: (name: string, value: string, options) => {
      const newSessionStr = serializeCookie(name, value, {
        ...options,
        // Allow supabase-js on the client to read the cookie as well
        httpOnly: false,
      });
      resHeaders.append(name, newSessionStr);
    },
    getCookie: (name: string) => {
      const cookies = parseCookies(req.headers.get('cookie') ?? '');
      return cookies[name];
    },
    getRequestHeader: (name: string) => {
      return req.headers.get(name) || '';
    },
    options: {},
  });

  const {
    data: { session },
    error, // @ts-ignore CDN does not provide proper types
  } = await supabase.auth.setSession({ access_token, refresh_token });

  if (!session || error) {
    console.error('No session data', error);
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return { req, resHeaders, supabase, session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
