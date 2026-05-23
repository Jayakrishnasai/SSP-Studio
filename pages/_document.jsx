import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/CamFramesWebP/mobile/frame_000.webp"
          type="image/webp"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/CamFramesWebP/tablet/frame_000.webp"
          type="image/webp"
          media="(min-width: 768px) and (max-width: 1199px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/CamFramesWebP/desktop/frame_000.webp"
          type="image/webp"
          media="(min-width: 1200px)"
          fetchPriority="high"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
