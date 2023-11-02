import 'src/styles/theme/purpose.scss';
import localFont from 'next/font/local';
import MainLayout from '@/components/layout/Main';
import BasicLayout from '@/components/layout/Basic';
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
          Component.showLayout === false || router.pathname === '/_error' || router.pathname === '/404' ? (
            <BasicLayout pageTitle={Component.Title}>
              <Component {...pageProps} />
            </BasicLayout>
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
