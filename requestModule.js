'use strict';
let http = require('http');


function getHtmlFromUrl(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            const statusCode = res.statusCode;

            let error;
            if (statusCode !== 200) {
                error = new Error(`Request Failed.\n` +
                    `Status Code: ${statusCode}`);
            }
            if (error) {
                console.log(error.message);
                // consume response data to free up memory
                res.resume();
                reject(error);
            }

            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                resolve(rawData);
            });
        });
    });
}

module.exports.getHtmlFromUrl = getHtmlFromUrl;