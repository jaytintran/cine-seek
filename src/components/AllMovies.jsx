/* eslint-disable react/prop-types */
import Spinner from "./Spinner";
import MovieCard from "./MovieCard";

function AllMovies({ movies, isLoading, errorMessage, setSelectedMovie }) {
  return (
    <section className="all-movies">
      <h2 className="mt-[40px]">Recommended for Men</h2>
      {isLoading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <ul>
          {movies.map((movie) => (
            <MovieCard
              movie={movie}
              key={movie.id}
              onClick={() => {
                setSelectedMovie(movie);
              }}
            />
          ))}
        </ul>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </section>
  );
}

export default AllMovies;
