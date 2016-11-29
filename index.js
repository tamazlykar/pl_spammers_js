'use strict';

let requestModule = require('./requestModule');
let searchModule = require('./search');

let host = 'http://www.csd.tsu.ru';

let awaitingLinks = new Set();
let passedLinks = new Set();
let emailsSet = new Set();

let boundary = 10;

function search(text) {
    searchModule.getEmailList(text)
        .then(result => {
            console.log(result);
            addEmails(result);
        },
        error => {
            console.log(error);
        });

    searchModule.getUrlList(text)
        .then(result => {
            addLinks(result);
        },
        error => {
            console.log(error);
        });
}


function addLinks(links) {
    for (let i = 0; i < links.length; i++) {
        if (!passedLinks.has(links[i])) {
            awaitingLinks.add(links[i]);
        }
    }

    awaitingLinks.forEach((val, val2, awaitingLinks) => {
        console.log(val);
    })
}

function addEmails(emails) {
    for (let i = 0; i < emails.length; i++) {
        emailsSet.add(emails[i]);
    }

    emailsSet.forEach((val, val2, emailsSet) => {
        console.log(val);
    })
}


// Execution start point


searchModule.buildUrlPatternRegExp(host);

let myUrl = host;

do {
    passedLinks.add(myUrl);
    requestModule.getHtmlFromUrl(myUrl)
        .then(result => {
                search(result);
            },
            error => {
                console.log(error);
            });

    myUrl = awaitingLinks;  // from here
} while (passedLinks < boundary);

console.log(passedLinks.length);
