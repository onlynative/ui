import type { PropsWithChildren } from 'react'

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/*
          SPA redirect handler for GitHub Pages.
          The custom 404.html stores the original path in sessionStorage
          before redirecting to /ui/demo/. This script restores it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var redirect = sessionStorage.getItem('spa-redirect')
                if (redirect) {
                  sessionStorage.removeItem('spa-redirect')
                  var base = '/ui/demo/'
                  history.replaceState(null, '', base + redirect)
                }
              })()
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
