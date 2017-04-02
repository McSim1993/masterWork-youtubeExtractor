/**
 * Created by McSim on 11.11.2016.
 */
;"use strict";

var YoutubeExtractor = require('./youtubeExtractor');

var videoId = global.process.argv[2];
var filePath = global.process.argv[3];

var extractor = new YoutubeExtractor('AIzaSyAXJWbS_FNKrYx2mWnnMogbL4byBrBImEI');

extractor.extractComments(videoId, filePath)
    .then(() => {
       console.log('done');
    });
