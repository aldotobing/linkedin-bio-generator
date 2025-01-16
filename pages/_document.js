import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="icon"
          href="https://aldotobing.github.io/assets/img/favicon.png"
        />

        <meta
          name="description"
          content="LinkedIn Bio Generator - Generate professional LinkedIn bios effortlessly."
        />
        <meta property="og:title" content="LinkedIn Bio Generator" />
        <meta
          property="og:description"
          content="Generate professional LinkedIn bios effortlessly."
        />
        <meta
          property="og:image"
          content="https://aldotobing.github.io/assets/img/preview.svg"
        />
        <meta
          property="og:url"
          content="https://aldotobing.github.io/linkedin-bio-generator"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
