const $ = require('jquery');

const loadingGif = () => {
        $('.container').html("<img src='./page-loader.gif' class='loader'>");
};

module.exports = loadingGif;