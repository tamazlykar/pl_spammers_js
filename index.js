'use strict';

let requestModule = require('./requestModule');
let searchModule = require('./search');

let host = 'http://www.mosigra.ru';

let awaitingLinks = new Set();
let passedLinks = new Set();
let emailsSet = new Set();

let boundary = 20;
let counter = 0;

let opinion = true;

function search(text) {
    return new Promise((resolve, reject) => {
        let p1 = searchModule.getEmailList(text)
            .then(result => {
                    addEmails(result);
                },
                error => {
                    console.log(error);
                });

        let p2 = searchModule.getUrlList(text)
            .then(result => {
                    addLinks(result);
                },
                error => {
                    console.log(error);
                });

        Promise.all([p1, p2]).then(val => resolve());
    });
}


function addLinks(links) {
    for (let i = 0; i < links.length; i++) {
        if (!passedLinks.has(links[i])) {
            awaitingLinks.add(links[i]);
        }
    }

    awaitingLinks.forEach((val, val2, awaitingLinks) => {
        //console.log(val);
    })
}

function addEmails(emails) {
    for (let i = 0; i < emails.length; i++) {
        emailsSet.add(emails[i]);
    }

    emailsSet.forEach((val, val2, emailsSet) => {
        //console.log(val);
    })
}

function parsePage(url) {
    console.log('Parsing this url:' + url);

    passedLinks.add(url);
    requestModule.getHtmlFromUrl(url)
        .then(result => {
                search(result).then(res => {
                    counter++;
                    decider();
                    run();
                });
            },
            error => {
                console.log(error);
            });
}

function decider() {
    if (!(counter < boundary && awaitingLinks.size != 0)) {
        opinion = false;

        printEmails();
    }
}

function run() {
    if (opinion) {
        let setIter = awaitingLinks.values();
        let url = setIter.next().value;
        awaitingLinks.delete(url);

        parsePage(url);
    }
}

function printEmails() {
    console.log('\n');
    console.log('Email\'s:');
    emailsSet.forEach((val, val2, emailsSet) => {
        console.log(val);
    })
}

// Execution start point

searchModule.buildUrlPatternRegExp(host);

let myUrl = host;

parsePage(myUrl);


