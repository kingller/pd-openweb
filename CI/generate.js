const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const moment = require('moment');
const cheerio = require('cheerio');
const minify = require('html-minifier').minify;
const _ = require('lodash');
const { htmlTemplatesPath, getEntryName, getEntryFromHtml } = require('./utils');
const { apiServer, webpackPublicPath } = require('./publishConfig');

const isProduction = process.env.NODE_ENV === 'production';

const buildPath = path.join(__dirname, '../build');
const htmlDestPath = path.join(__dirname, '../build/files');

function mkdir(dirPath) {
  dirPath = path.resolve(__dirname, dirPath);
  if (fs.existsSync(dirPath)) {
    return;
  } else {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getPublicPath(type) {
  if (!isProduction) return webpackPublicPath;

  const path = _.isArray(webpackPublicPath)
    ? webpackPublicPath[_.random(0, webpackPublicPath.length - 1)]
    : webpackPublicPath;

  return type === 'index' ? path : path.replace('/dist/pack/', `/dist/${type}/pack/`);
}

function destHtml(filename, html) {
  fs.writeFileSync(
    path.join(htmlDestPath, filename),
    isProduction
      ? minify(html, {
          collapseWhitespace: true,
          minifyJS: { unused: 'keep_assign' },
        })
      : html,
  );
}

function generate() {
  mkdir(htmlDestPath);
  fs.readdirSync(htmlTemplatesPath).forEach(filename => {
    let html = fs.readFileSync(path.join(htmlTemplatesPath, filename)).toString();
    const entry = getEntryFromHtml(filename);
    const apiMap = {
      main: isProduction ? apiServer : '/api/',
    };
    if (entry) {
      const moduleName = getEntryName(entry.src, filename);

      if (!isProduction) {
        apiMap.workflow = '/workflow_api';
        apiMap.report = '/report_api';
        apiMap.integration = '/integration_api';
        apiMap.datapipeline = '/data_pipeline_api';
        apiMap.workflowPlugin = '/workflow_plugin_api';
      }
      html = ejs.compile(html)({
        apiServer: JSON.stringify(apiMap),
        releaseDate: moment().format('YYYY/MM/DD HH:mm:SS'),
        publicPath: getPublicPath(entry.type),
      });
      html = html.replace(
        '</head>',
        `<link href="https://assets.gaiaworkforce.com/libs/pandora/29.3.0/pandora.min.css" rel="stylesheet" crossorigin="" integrity="sha384-k/NjdzlqplJ2gZYniD2oVCcXsrymstMbkUJayjUcu5JsK5TIoeunpMD08wWpLB64">
        <script>
          if (
            navigator.userAgent.toLowerCase().match(/(msie\\s|trident.*rv:)([\\w.]+)/) ||
            (navigator.userAgent.toLowerCase().match(/(chrome)\\/([\\w.]+)/) && parseInt(navigator.userAgent.toLowerCase().match(/(chrome)\\/([\\w.]+)/)[2]) < 50)
          ) {
            location.href = '/browserupgrade';
          }
          this.globalThis || (this.globalThis = this)
        </script>
        <script src="/staticfiles/staticLanguages.js"></script>
        </head>`,
      ).replace(/<body[^>]*>/, (match) => `${match}${
        `<script src="https://assets.gaiaworkforce.com/libs/babel-polyfill/7.12.1/polyfill.min.js" crossorigin="" integrity="sha384-FCwalFIn/oY5yqK5WoHWMqsdHAQgG5e8hoHwtQ/stzqubOMOvFXsWocs/XvlofdX"></script>
        <script src="https://assets.gaiaworkforce.com/libs/react/18.3.1/umd/react.production.min.js" crossorigin="" integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z"></script>
        <script src="https://assets.gaiaworkforce.com/libs/react-dom/18.3.1/umd/react-dom.production.min.js" crossorigin="" integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1"></script>
        <script src="https://assets.gaiaworkforce.com/libs/i18next/22.0.6/i18next.min.js" crossorigin="" integrity="sha384-K+smMP43jORkmerlPZ4OOiZaVoIA0RN2Qp3pJtQC463q+WDdn8RHajg8dnoBslBO"></script>
        <script src="https://assets.gaiaworkforce.com/libs/mobx/4.15.4/mobx.umd.min.js" crossorigin="" integrity="sha384-BWuWyZdx2hglCvqie0ePKarVs1ebjZpA/94WeTWknVSgBF4bDtxwQDl1nRiR7Ze9"></script>
        <script src="https://assets.gaiaworkforce.com/libs/mobx-react/6.3.1/index.min.js" crossorigin="" integrity="sha384-bSe+ulIxqETcpDWaa0K24ijbbw82GwjYspquX/FYrwt8ZCZTGAYqjYkwGcpyF1EY"></script>
        <script src="https://assets.gaiaworkforce.com/libs/lodash.js/4.17.21/lodash.min.js" crossorigin="" integrity="sha384-H6KKS1H1WwuERMSm+54dYLzjg0fKqRK5ZRyASdbrI/lwrCc6bXEmtGYr5SwvP1pZ"></script>
        <script src="https://assets.gaiaworkforce.com/libs/react-router-dom/4.4.0/react-router-dom.min.js" crossorigin="" integrity="sha384-chb8/LDXmdl26IJ0f2ct42V4Nf7bUoorL2fuDYZi90uakuTDDsvo3jd+zyVoDHmE"></script>
        <script src="https://assets.gaiaworkforce.com/libs/dayjs/1.11.9/dayjs.min.js" crossorigin="" integrity="sha384-ok2ureoh4h8/yzfhscH9aGBd1IrWT0jPFG7JF7dbo+uFAQCn3jc6nY1AYH5y6hhv"></script>
        <script src="https://assets.gaiaworkforce.com/libs/pandora/29.3.0/pandora.min.js" crossorigin="" integrity="sha384-xfO8RewJQIfrXgWRCfqQv5eRE5ZrzS7nW/n+elZooLnK/tyNhIPW7dH3/dMj+iS6"></script>
        <script src="https://assets.gaiaworkforce.com/libs/jquery/3.6.0/jquery.min.js" integrity="sha384-vtXRMe3mGCbOeY7l30aIg8H9p3GdeSe4IFlP6G8JMa7o7lXvnz3GFKzPxzJdPfGK" crossorigin="anonymous"></script>`
      }`);
      const $ = cheerio.load(html);
      const $entryScript = $('script')
        .filter((i, node) => $(node).attr('src') === entry.origin)
        .eq(0);
      if (!$entryScript[0]) {
        destHtml(filename, html);
        return;
      }
      if (!isProduction) {
        // 开发模式
        $entryScript.replaceWith(
          ['modules_a', 'modules_b', 'core', 'common', 'vendors', 'globals', moduleName]
            .map(src => `<script src="${getPublicPath(entry.type) + src}.dev.js"></script>`)
            .join(''),
        );
      } else {
        // 发布模式
        let manifestData;
        manifestData = JSON.parse(
          fs
            .readFileSync(path.join(buildPath, `dist/${entry.type === 'index' ? '' : `${entry.type}/`}manifest.json`))
            .toString(),
        );
        const baseEntry =
          entry.type !== 'index'
            ? ['vendors', 'globals']
            : ['modules_a', 'modules_b', 'core', 'common', 'vendors', 'globals'];
        const isWidgetContainer = moduleName.startsWith('widget-container');
        $entryScript.replaceWith(
          [...(!isWidgetContainer ? baseEntry : []), moduleName]
            .filter(key => !!manifestData[key] && manifestData[key].js)
            .map(key => `<script src="${getPublicPath(entry.type) + manifestData[key].js}"></script>`)
            .join(''),
        );
        if (!isWidgetContainer) {
          $('head').append(
            ['css', ...baseEntry, moduleName]
              .filter(key => !!manifestData[key] && manifestData[key].css)
              .map(key => `<link rel="stylesheet" href="${getPublicPath(entry.type) + manifestData[key].css}" />`)
              .join(''),
          );
        }
      }
      destHtml(filename, $.html());
    } else {
      html = ejs.compile(html)({
        apiServer: JSON.stringify(apiMap),
      });
      destHtml(filename, html);
    }
  });
}
module.exports = generate;
