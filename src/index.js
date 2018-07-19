/**
 * es6 modules and imports
 */
import $ from 'jquery';
// const {loadingGifMain, loadingGifUpdate} = require('./hello');
import loadingGifMain from './hello';
import getMovies from './getMovies.js';

loadingGifMain();

//============================================= Generate Movie List ================================ localhost:1313 ====

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

                                `<i class="fa fa-spinner fa-spin editBtnGif" style="display: none"></i>` +

                                `<i class="fas fa-ban cancelBtn" style="display: none" data-id="${id}"></i>` +

                                `<i class="far fa-trash-alt deleteBtn" data-id="${id}"></i>` +

                                `<i class="fa fa-spinner fa-spin deleteBtnGif" style="display: none"></i>` +

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
            $('#movieTitleInputLabel').focus();
        });
    });



    let clearForm = () => {
        $('#movieTitleInput').val('');
        $('#selectMovieRating').val('');
    };

//==================================================== Edit Movie ======================================================

$('.container').on("click", ".editBtn", function() {

    $(this).siblings('.editBtnGif').css({display: "inline-block"});
    $(this).css({display: "none"});

    let id = $(this).attr("data-id");

    let request = $.ajax({
        url: '/api/movies/' + id,
        method: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: id
    });
    request.done((movie) => {

        $(this).siblings('.editBtnGif').css({display: "none"});
        $(this).siblings('.cancelBtn').css({display: "inline-block"});

        //after you click the edit button: scroll down to form:
        $('.formArea').css({display: "inline-block"});
        $('html,body').animate({
            scrollTop: $("#form-section").offset().top}, 'slow');

        $('select').val(movie.rating);
        $('#movieTitleInput').val(movie.title);
        //hide the submit button:
        // $('#submitMovie').css({display: "none"});
        $('#submitMovieBtn').css({display: "none"});
        //reveal the edit button:
        // $('#updateMovie').css({display: "inline-block"});
        $('#updateMovieBtn').css({display: "inline-block"});
        // hide the materialize css placeholder and place cursor in input field (focus):
        $('#movieTitleInputLabel').focus();
        // grab the id from the edit button and add it to the update button
        $('#updateMovieBtn').attr("data-id", $(this).attr("data-id"));

    });
});

//============================================== Cancel Editing ========================================================

$('.container').on("click", ".cancelBtn", function() {

    $(this).hide();
    $(this).siblings('.editBtn').show();
    clearForm();
    $('#movieTitleInputLabel').focus();
    $('#updateMovieBtn').hide();
    $('#submitMovieBtn').show();
});

//================================================ Update Movie ========================================================

$('#updateMovieBtn').on("click", function() {

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
        $('#submitMovieBtn').show();
        generateMovieList();
        clearForm();
        $('#movieTitleInputLabel').focus();
    });
});

//============================================ Delete Movie ============================================================

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
            clearForm();
            $('#movieTitleInputLabel').focus();
        });
    });
});

