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

            let htmlBuilder = '<table class="movies highlight centered" id="movie-list">';
                htmlBuilder += '<thead>';
                    htmlBuilder += '<tr>';
                        htmlBuilder += '<th>Film</th>';
                        htmlBuilder += '<th>Rating</th>';
                        htmlBuilder += '<th>Options</th>';
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
            console.log(title, stars, id);
            htmlBuilder += `<tr><td id="tdTitle">${title}</td><td id="tdStars">${stars}</td>`;
            htmlBuilder += `<td id="tdBtns">` +

                                `<i class="far fa-edit editBtn" disabled data-id="${id}"></i>` +

                                `<i class="fa fa-spinner fa-spin editBtnGif" style="display: none"></i>` +

                                `<i class="fas fa-ban cancelBtn" style="display: none" data-id="${id}"></i>` +

                                `<i class="far fa-trash-alt deleteBtn" disabled data-id="${id}"></i>` +

                                `<i class="fa fa-spinner fa-spin deleteBtnGif" style="display: none"></i>` +

                            `</td></tr>`;
        });

        htmlBuilder += '</table>';

        $('.container').html(htmlBuilder).animate({opacity: 1});
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

    $('#submitMovieBtn').on("click", function (e) {
        e.preventDefault();

        if($('#movieTitleInput').val() !== "" && $('#selectMovieRating option:selected').val() !== "") {
            $(this).attr("disabled", true);

            // $('#submitMovieBtn').html(`<img src='./page-loader.gif' id="submitGif">`).css({});
            $('#submitMovieBtn').hide();
            $('#submitMovieBtnGif').show();

            let title = $('#movieTitleInput').val();
            let rating = $('#selectMovieRating').val();
            let movie = {
                title: title,
                rating: rating,
            };

            fetch('/api/movies', {
                headers: {
                    "content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({title, rating})
            }).then((response) => {
                response.json();
            }).then(() => {
                generateMovieList();
                clearForm();
                $('#submitMovieBtnGif').hide();
                $('#submitMovieBtn').removeAttr("disabled");
                $('#submitMovieBtn').show();
                $('#movieTitleInputLabel').focus();
            });
        }
    });


    let clearForm = () => {
        $('#movieTitleInput').val('');
        $('#selectMovieRating').val('');
    };

//==================================================== Edit Movie ======================================================

$('.container').on("click", ".editBtn", function() {

    $(this).siblings('.editBtnGif').css({display: "inline-block"});
    $(this).css({display: "none"});
    $('.editBtn').prop("disabled",true);  // Disable all other buttons of this class name. "disabled" must be on the html element
    $('.deleteBtn').prop("disabled",true);


    let id = $(this).attr("data-id");

    let request = $.ajax({
        url: '/api/movies/' + id,
        method: 'GET',
        data: id
    });
    request.done((movie) => {

        $(this).siblings('.editBtnGif').css({display: "none"});
        $(this).siblings('.cancelBtn').css({display: "inline-block"});

        //after you click the edit button: scroll down to form:
        $('.formArea').css({display: "inline-block"});
        $('html,body').animate({
            scrollTop: $("#form-section").offset().top}, 'fast');

        $('select').val(movie.rating);
        $('#movieTitleInput').val(movie.title);
        //hide the submit button:
        $('#submitMovieBtn').css({display: "none"});
        //reveal the edit button:
        $('#updateMovieBtn').css({display: "inline-block"});
        // hide the materialize css placeholder and place cursor in input field (focus):
        $('#movieTitleInputLabel').focus();
        // grab the id from the edit button and add it to the update button
        $('#updateMovieBtn').attr("data-id", $(this).attr("data-id"));
        // Allow other buttons to be clicked again
        $('.deleteBtn').prop("disabled", false);
        $('.editBtn').prop("disabled",false);

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

    if($('#movieTitleInput').val() !== "" && $('#selectMovieRating option:selected').val() !== "") {
        $(this).attr("disabled", true);

        $('#updateMovieBtn').hide();
        $('#updateMovieBtnGif').show();

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
        }).then(() => {
            $(this).attr("disabled", false);
            $('#updateMovieBtnGif').hide();
            $('#submitMovieBtn').show();
            generateMovieList();
            clearForm();
            $('#movieTitleInputLabel').focus();
            // $("html, body").animate({
            //         scrollTop: $(".editBtn").offset().top
            //     },
            //     'fast');
        });
    }
});

//============================================ Delete Movie ============================================================

$('.container').on("click", ".deleteBtn", function() { //any descendants in container with class deletebtn will have a click listener on it.

    $(this).hide();
    $(this).siblings('.deleteBtnGif').show();
    $('.editBtn').prop("disabled",true);
    $('.deleteBtn').prop("disabled",true);

    let id = $(this).attr("data-id");

    fetch(`/api/movies/${id}`, {
        headers: {
            "content-type": "application/json"
        },
        method: "DELETE",
    }).then(() => {
        generateMovieList();
        clearForm();
        $('#movieTitleInputLabel').focus();
        $('.deleteBtn').prop("disabled", false);
        $('.editBtn').prop("disabled",false);

    });
});

