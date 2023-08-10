import 'src/styles/theme/purpose.scss';
import localFont from 'next/font/local';
import MainLayout from '@/components/layout/Main';

const REM = localFont({ src: '../../public/fonts/REM.ttf' });

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${REM.style.fontFamily};
        }
      `}</style>

      <MainLayout pageTitle={Component.Title}>
        <Component {...pageProps} />
      </MainLayout>
    </>
  )
}
