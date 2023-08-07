import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/images/icons/favicon.svg" type="image/svg+xml" />
      </Head>
      <body className="application application-offset">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
