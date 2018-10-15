// @flow
/* eslint-disable react/no-danger */
import React from 'react';
import Helmet from 'react-helmet';

type PropsT = {
  children: *,
  css: string[],
  scripts: string[],
  state: string,
};

export default class HTML extends React.Component<PropsT> {
  static defaultProps = {
    css: [],
    scripts: [],
    state: '{}',
  };

  render() {
    const head = Helmet.renderStatic();
    const { children, scripts, css, state } = this.props;
    return (
      <html lang="en-us">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <link href="https://fonts.googleapis.com/css?family=Bangers" rel="stylesheet" />
          <link href="https://rsms.me/inter/inter-ui.css" rel="stylesheet" />
          {css.map((href) => {
            return <link key={href} rel="stylesheet" href={href} />;
          })}
          <link rel="stylesheet" href="/static/bundle.css" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__PRELOADED_STATE__ = ${state}`,
            }}
          />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          {scripts.map((src) => {
            return <script key={src} src={src} />;
          })}
        </body>
      </html>
    );
  }
}
