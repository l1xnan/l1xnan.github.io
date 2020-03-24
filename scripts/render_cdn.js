var Url = require('url');
var Soup = require('soup');

hexo.extend.filter.register('before_generate', function() {
  hexo.extend.filter.register('after_render:html', render_cdn);
});

function isLocalPath(filePath) {
  return (
    typeof filePath === 'string' &&
    filePath.length &&
    filePath.indexOf('//') === -1 &&
    filePath.indexOf('data:') !== 0
  );
}

function resolveUrl(base, origUrl, tail) {
  if (tail) {
    origUrl += (origUrl.indexOf('?') === -1 ? '?' : '&') + tail;
  }
  /**
   * compatible `base = //cdn.host/cdn/`
   * replce host with url.resolve so :
   *
   * Before:
   * Url.resolve('//cdn.host/cdn/','/images/')  ==>  //cdn.host/images
   *
   * After:
   * Url.resolve('//cdn.host/cdn/','./images/') ==> //cdn.host/cdn/images
   *
   */
  if (origUrl[0] === '/') {
    origUrl = '.' + origUrl;
  }
  return Url.resolve(base, origUrl);
}

function toArray(value) {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

const tagAttrs = {
  'img[data-src]': 'data-src',
  'img[src]': 'src',
  'link[rel="apple-touch-icon"]': 'href',
  'link[rel="icon"]': 'href',
  'link[rel="shortcut icon"]': 'href',
  'link[rel="stylesheet"]': 'href',
  'script[src]': 'src',
  'source[src]': 'src',
  'video[poster]': 'poster',
};

/**
 * @param
 * cdn
 *   enable: true
 *   exclude:
 */
function render_cdn(str, data) {
  const hexo = this;
  let {
    enable = true,
    exclude = [],
    tags,
    excludeTags,
    base,
    tail = '',
  } = hexo.config.cdn;

  //return if disable
  if (!enable) {
    return;
  }

  exclude = toArray(exclude);

  const path = data.path;
  if (path && exclude.length) {
    for (var i = 0, len = exclude.length; i < len; i++) {
      if (new RegExp(exclude[i]).test(path)) {
        return str;
      }
    }
  }

  let rewriteURL = origUrl =>
    isLocalPath(origUrl) ? resolveUrl(base, origUrl, tail) : origUrl;

  let soup = new Soup(str);

  if (tags && typeof tags === 'object') {
    tagAttrs = { ...tagAttrs, ...tags };
  }

  if (excludeTags) {
    excludeTags = Array.isArray(excludeTags) ? excludeTags : [excludeTags];
    Object.keys(tagAttrs).forEach(key => {
      let tagKey = key.replace(/(\[.*\]|\(.*\))|\{.*\}/g, '');
      if (~excludeTags.indexOf(tagKey)) {
        delete tagAttrs[key];
      }
    });
  }

  for (let search in tagAttrs) {
    if (tagAttrs.hasOwnProperty(search)) {
      var attr = tagAttrs[search];
      if (attr) {
        soup.setAttribute(search, attr, rewriteURL);
      }
    }
  }

  const log = hexo.log || console.log;
  log.log('CDN update:' + path);
  return soup.toString();
}
