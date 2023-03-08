import '@styles/globals.css';
import { Footer } from 'componets/footer';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  // Add Head tags here

  return (
    <>
      <Head>
        <title>Preference-based course allocation</title>
      </Head>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
