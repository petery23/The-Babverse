document.addEventListener('DOMContentLoaded', () => {
    const movieList = document.getElementById('movieList');
    const movies = Array.from(movieList.children);

    movies.forEach(movie => {
        movie.addEventListener('click', () => {
            if (!movie.classList.contains('watched')) {
                movie.classList.add('watched');
                sortMovies();
            }
        });
    });

    function sortMovies() {
        const watchedMovies = movies.filter(movie => movie.classList.contains('watched'));
        const unwatchedMovies = movies.filter(movie => !movie.classList.contains('watched'));

        movieList.innerHTML = '';
        watchedMovies.forEach(movie => movieList.appendChild(movie));
        unwatchedMovies.forEach(movie => movieList.appendChild(movie));
    }

    sortMovies();
});
