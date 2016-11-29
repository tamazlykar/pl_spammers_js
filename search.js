'use strict';

let host;

let emailPattern = new RegExp('[a-zA-Z0-9-]+(?:[._+%-]+[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]+[.-]?)+[.][a-zA-Z]{2,}', 'g');
let urlPattern = 'href="(?:<siteURL>)?(?:\\.\\.)*(?:\/?[a-zA-Z0-9%\\-])+\\??(?:[a-zA-Z0-9]+\\=[a-zA-Z0-9_%\\-]+[;&]?)*(?:\\.html|\\.htm|\\/)?"';


function buildUrlPatternRegExp(url) {
    host = url;

    let changedUrl = url.replace(/\//g, '\\\/');
    changedUrl = changedUrl.replace(/\./g, '\\\.');

    urlPattern = urlPattern.replace('<siteURL>', changedUrl);
    urlPattern = new RegExp(urlPattern, 'g');
}

function getEmailList(text) {
    return new Promise((resolve, reject) => {
        resolve(text.match(emailPattern));
    })
}

function getUrlList(text) {
    return new Promise((resolve, reject) => {
        let urls = text.match(urlPattern);

        for (let i = 0; i < urls.length; i++) {
            urls[i] = getAbsoluteUrl(deleteHref(urls[i]));
        }

        resolve(urls);
    })
}

function deleteHref(url) {
    let result = url.slice(0, -1);
    result = result.slice(6);

    return result;
}

function getAbsoluteUrl(path) {
    if (path[0] == '/') {
        return host + path;
    } else if (path.startsWith('http://') == false) {
        return host + '/' + path;
    }

    return path;
}

module.exports.buildUrlPatternRegExp = buildUrlPatternRegExp;
module.exports.getEmailList = getEmailList;
module.exports.getUrlList = getUrlList;
