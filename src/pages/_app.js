/* import 'bootstrap/dist/css/bootstrap.css'; */
import 'src/styles/theme/purpose.scss';
import localFont from 'next/font/local';
import { SessionProvider } from 'next-auth/react';

const REM = localFont({ src: '../../public/fonts/REM.ttf' });

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${REM.style.fontFamily};
        }
      `}</style>

      <SessionProvider session={session}>
        <div className="container-fluid container-application">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  )
}
