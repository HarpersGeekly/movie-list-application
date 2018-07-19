// const $ = require('jquery');
import $ from 'jquery';
// choose either require or import and stick with it consistently over the app.
//import is typically for front-end js, require typically back-end js

const loadingGifMain = () => {
        $('.container').html("<img src='./page-loader.gif' id='loader'>");
        // $('.container').html("<i class='fas fa-spinner fa-spin' id='openingGif'></i>");
};

// const loadingGifUpdate = () => {
//         $('#updateMovieBtn').html("<img src='./page-loader.gif' class='loader' >");
// };
// // const loadingGifSubmit = () => {
//     $('#submitMovie').html("<img src='./page-loader.gif' class='loader'>");
// };
//
//
// const loadingGifDelete = () => {
//     $('#deleteBtn').html("<img src='./page-loader.gif' class='loader'>");
// };
// module.exports = {loadingGifMain, loadingGifUpdate};
module.exports = loadingGifMain;

// module.exports = loadingGifMain;
// module.exports = loadingGifSubmit;
// module.exports = loadingGifUpdate;
// module.exports = loadingGifDelete;