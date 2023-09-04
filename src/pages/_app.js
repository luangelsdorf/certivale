import 'src/styles/theme/purpose.scss';
import localFont from 'next/font/local';
import MainLayout from '@/components/layout/Main';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';

const REM = localFont({ src: '../../public/fonts/REM.ttf' });

export default function App({ Component, pageProps: { session, ...pageProps } }) {

  const router = useRouter();

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${REM.style.fontFamily};
        }
      `}</style>

      <SessionProvider refetchOnWindowFocus={false} session={session}>
        {
          router.pathname === '/_error' || router.pathname === '/404' ? (
            <Component {...pageProps} />
          ) : (
            <MainLayout pageTitle={Component.Title}>
              <Component {...pageProps} />
            </MainLayout>
          )
        }
      </SessionProvider>
    </>
  )
}
