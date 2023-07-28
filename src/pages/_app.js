/* import 'bootstrap/dist/css/bootstrap.css'; */
import 'src/styles/theme/purpose.scss';
import localFont from 'next/font/local';

const REM = localFont({ src: '../../public/fonts/REM.ttf' });

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${REM.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
