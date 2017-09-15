/**
 * es6 modules and imports
 */
import $ from 'jquery';
import loadingGif from './hello';
import getMovies from './getMovies.js';

loadingGif();
//============================================= Generate Movie List ====================================================
const generateMovieList = () => {
    getMovies().then((movies) => {

        let htmlBuilder = '<div id="movie-list">';
        htmlBuilder += '<h1 id="movie-list-header">Movie List</h1><hr>';
        htmlBuilder += '<table class="movies">';
        htmlBuilder += '<tr>';
        htmlBuilder += '<th>Movie Title</th>';
        htmlBuilder += '<th>Rating</th>';
        htmlBuilder += '<th>Actions</th>';
        htmlBuilder += '</tr>';

        movies.forEach(movie =>{
            movie['stars'] = "";
            for(let i = 0; i < movie.rating; i++){
                movie['stars'] += '&#9733';
            }
        });


        movies.forEach(({title, stars, id}) => {
            htmlBuilder += `<tr><td>${title}</td><td>${stars}</td>`;
            htmlBuilder += `<td><a class="editBtn" data-id="${id}">Edit</a><a class="deleteBtn" data-id="${id}">DELETE</a></td></tr>`;
        });

        htmlBuilder += '</table>';
        htmlBuilder += '<div class="wrapper">' +
            '<a id="addMovieBtn">Add Movie</a>' +
            '</div>';
        htmlBuilder += '</div>';

        $('.container').html(htmlBuilder).animate({opacity: 1});
        $('#movie-list').animate({opacity: 1});
        $('#addMovieBtn').click(function () {
            $('.formArea').css({display: "inline-block"});
            $('#submitMovie').css({display: "inline-block"});
            $('#updateMovie').css({display: "none"});
            $('html,body').animate({
              scrollTop: $("#form-section").offset().top}, 'slow');
            clearForm();
        });

    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
};
generateMovieList();

//========================================== Submit Movie Form =========================================================
    $('#submitMovie').click(function() {
        let title = $('#formMovieTitle').val();
        let rating = $('#formMovieRating').val();
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
        });
        clearForm();
        loadingGif();
    });

    let clearForm = () => {
        $('#formMovieTitle').val('');
        $('#formMovieRating').val('');
    };

//==================================================== Edit Movie ======================================================

$('.container').on("click", ".editBtn", function(e) {

        //after you click the edit button: scroll down to form:
        $('.formArea').css({display: "inline-block"});
        $('html,body').animate({
            scrollTop: $("#form-section").offset().top}, 'slow');
        //hide the submit button:
        $('#submitMovie').css({display: "none"});
        //reveal the edit button:
        $('#updateMovie').css({display: "inline-block"});
        // grab the id from the edit button and add it to the update button
        $('#updateMovie').attr("data-id", $(this).attr("data-id"));
        // traverse the dom and look for the values in the table and save those to variables. make sure "e"target is in the above function parameter: function(e)
        let getTitle = ($(e.target).parent().parent().children().first().html()); // finds the title in the table
        let getRating = ($(e.target).parent().parent().children().eq(1).html());  // finds the rating in the table
        // populate the form fields with that newly found data:
        $('#formMovieTitle').val(getTitle);
        $('#formMovieRating').val(getRating);

        //======================================== Update Movie ========================================================

        $('#updateMovie').click( function() {
          loadingGif();

            let id = $(this).attr("data-id");
            let title = $('#formMovieTitle').val();
            let rating = $('#formMovieRating').val();
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
            }).then((response) => {
                response.json();
            }).then(() => {
                generateMovieList();
            });
        });
});

//=================================================== DELETE Movie =====================================================

$('.container').on("click", ".deleteBtn", function() { //any descendants in container with class deletebtn will have a click listener on it.

    let id = $(this).attr("data-id");
    loadingGif();

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

