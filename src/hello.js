const $ = require('jquery');

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