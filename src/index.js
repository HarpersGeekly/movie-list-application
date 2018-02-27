/**
 * es6 modules and imports
 */
import $ from 'jquery';
// const {loadingGifMain, loadingGifUpdate} = require('./hello');
import loadingGifMain from './hello';
import getMovies from './getMovies.js';

// import loadingGifSubmit from './hello';
// import loadingGifUpdate from './hello';
// import loadingGifDelete from './hello';

loadingGifMain();

//============================================= Generate Movie List ====================================================
const generateMovieList = () => {
    getMovies().then((movies) => {

        // let htmlBuilder =
        let htmlBuilder = '<div id="movie-list">';
            htmlBuilder += '<table class="movies highlight centered responsive-table">';
                htmlBuilder += '<thead>';
                    htmlBuilder += '<tr>';
                        htmlBuilder += '<th>Film</th>';
                        htmlBuilder += '<th>Rating</th>';
                        htmlBuilder += '<th>Actions</th>';
                    htmlBuilder += '</tr>';
            htmlBuilder += '</thead>';

        // ===== show the stars in rating column ======
        movies.forEach(movie =>{
            movie['stars'] = "";
            for(let i = 0; i < movie.rating; i++){
                movie['stars'] += '&#9733';
            }
        });

        // ===== show all movies ======
        movies.forEach(({title, stars, id}) => {
            htmlBuilder += `<tr><td id="tdTitle">${title}</td><td id="tdStars">${stars}</td>`;
            htmlBuilder += `<td id="tdBtns">` +

                                `<i class="far fa-edit editBtn" data-id="${id}"></i>` +

                                `<i class="fas fa-ban cancelBtn" style="display:none" data-id="${id}"></i>` +

                                `<i class="fas fa-trash-alt deleteBtn" data-id="${id}"></i>` +

                                `<i class="fas fa-spinner fa-spin deleteBtnGif" style="display:none"></i>` +

                            `</td></tr>`;
        });

        htmlBuilder += '</table>';
        htmlBuilder += '</div>';

        let htmlBuilder2 = '<a id="addMovieBtn" class="waves-effect waves-light"><i class="fas fa-plus"></i> Add Movie...</a>';
                            // '<a id="addMovieBtnGif" class="waves-effect waves-light"><img src=\'./page-loader.gif\' class=\'loader\' id="updateGif"></a>';

        $('.container').html(htmlBuilder).animate({opacity: 1});
        $('.addMovie').html(htmlBuilder2).animate({opacity: 1});
        $('#movie-list').animate({opacity: 1});

        // ====== click the add movie button to reveal the form =======
        $('#addMovieBtn').click(function () {
            $('.formArea').css({display: "inline-block"});
            $('#submitMovieBtn').css({display: "inline-block"});
            $('#updateMovieBtn').css({display: "none"});
            $('#movieTitleInput').focus();
            $('#movieTitleInputLabel').css({display:"inline-block"});
            $('html,body').animate({
              scrollTop: $("#form-section").offset().top
            }, 'slow');
            clearForm();
        });

    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
};
generateMovieList();

//========================================== Submit Movie Form =========================================================

    $('#submitMovieBtn').on("click", function() {

        $('#submitMovieBtn').html(`<img src='./page-loader.gif' id="submitGif">`).css({width:"25.5%"});

        let title = $('#movieTitleInput').val();
        let rating = $('#selectMovieRating').val();
        let movie = {
            title: title,
            rating: rating,
        };
        console.log(movie);

        fetch('/api/movies', {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({title, rating})
        }).then( (response) => {
            response.json();
        }).then(() => {
          generateMovieList();
            clearForm();
        $('#submitMovieBtn').html("click to submit movie");
        });
    });

    let clearForm = () => {
        $('#movieTitleInput').val('');
        $('#selectMovieRating').val('');
    };

//==================================================== Edit Movie ======================================================

$('.container').on("click", ".editBtn", function(e) {

    $(this).hide();
    $(this).siblings('.cancelBtn').show();

    $('.cancelBtn').click(function() {
        $(this).hide();
        $(this).siblings('.editBtn').show();
        clearForm();
        $('#movieTitleInputLabel').focus();
        $('#updateMovieBtn').hide();
        $('#submitMovieBtn').show();

    });

    //after you click the edit button: scroll down to form:
        $('.formArea').css({display: "inline-block"});
        $('html,body').animate({
            scrollTop: $("#form-section").offset().top}, 'slow');

        //hide the submit button:
        // $('#submitMovie').css({display: "none"});
        $('#submitMovieBtn').hide();
        //reveal the edit button:
        // $('#updateMovie').css({display: "inline-block"});
        $('#updateMovieBtn').show();
        // hide the materialize css placeholder and place cursor in input field (focus):
        $('#movieTitleInputLabel').css({display: "none"}).focus();

        // grab the id from the edit button and add it to the update button
        $('#updateMovieBtn').attr("data-id", $(this).attr("data-id"));
        // traverse the dom and look for the values in the table and save those to variables. make sure "e"target is in the above function parameter: function(e)
        let getTitle = ($(e.target).parent().parent().children().first().html()); // finds the title in the table
        let getRating = ($(e.target).parent().parent().children().eq(1).html());  // finds the rating in the table
        // populate the form fields with that newly found data:
        $('#movieTitleInput').val(getTitle);
        $('#selectMovieRating').val(getRating); //NEEDS TO POPULATE THE OPTION VALUE...DOES NOT?
});

        //======================================== Update Movie ========================================================

        $('#updateMovieBtn').click( function() {

            $('#updateMovieBtn').hide();
            $('#updateMovieBtnGif').show();
            // $('#updateGif').show();

            let id = $(this).attr("data-id");
            let title = $('#movieTitleInput').val();
            let rating = $('#selectMovieRating').val();
            let movie = {
                title: title,
                rating: rating,
                id: id
            };
            fetch(`/api/movies/${id}`, {
                headers: {
                    "content-type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify({title, rating})
            // }).then((response) => {
            //     response.json();
            }).then(() => {
                $('#updateMovieBtnGif').hide();
                generateMovieList();
                clearForm();
                $('#submitMovieBtn').show();
            });
        });


//=================================================== DELETE Movie =====================================================

$('.container').on("click", ".deleteBtn", function() { //any descendants in container with class deletebtn will have a click listener on it.

    $(this).hide();
    // $('.deleteBtnGif').css({display: "inline-block"});
    $(this).siblings('.deleteBtnGif').show();

    let id = $(this).attr("data-id");

    fetch(`/api/movies/${id}`, {
        headers: {
            "content-type": "application/json"
        },
        method: "DELETE",
    }).then(() => {
        getMovies().then((movie) => {
            generateMovieList();
        });
    });
});

