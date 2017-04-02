/**
 * Created by McSim on 11.11.2016.
 */
;"use strict";

var fs = require('fs');
var request = require('request');

module.exports = class YoutubeExtractor {

    constructor(apiKey) {
        this._key = apiKey;
    }

    extractComments(videoId, filename) {
        var out = fs.createWriteStream(filename);
        out.write('[\n');
        return this.nextPage(videoId, out, null).
            then(() => {
            out.write(']');
            out.end();
        });
    }

    nextPage(videoId, out, page) {
        return new Promise((resolve, reject) => {
            var qs = {
                key: this._key,
                part: 'snippet',
                videoId: videoId,
                maxResults: 100,
                textFormat: 'plainText'
            };
            if (page)
                qs['pageToken'] = page;
            request({
                url: 'https://www.googleapis.com/youtube/v3/commentThreads',
                qs: qs
            }, (error, responce, data) => {
                data = JSON.parse(data);
                data.items.forEach((comment, i, arr) => {
                    out.write(JSON.stringify(comment, null, '\t'));
                    if (data.nextPageToken || i < arr.length - 1)
                        out.write(',');
                    out.write('\n');
                });
                resolve(data.nextPageToken);
            });
        }).then((nextPage) => {
            return !!nextPage ? this.nextPage(videoId, out, nextPage) : null;
        });
    }
};