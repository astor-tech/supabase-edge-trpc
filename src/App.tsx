import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './supabase';

function App() {
  const [showAuth, setShowAuth] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // @ts-ignore
      const isUser = session?.user?.aud === 'authenticated';
      if (isUser) {
        setShowAuth(false);
      } else {
        setShowAuth(true);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // async function getCountries() {
  //   const { data } = await supabase.from('countries').select();
  //   setCountries(data);
  // }

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        '--colors-inputText': 'grey',
      }}
    >
      {showAuth ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
      ) : (
        <div>
          <button onClick={async () => await supabase.auth.signOut()}>Sign Out</button>
        </div>
      )}
    </main>
  );
}

export default App;
