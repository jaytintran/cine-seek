import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import ToggleButtons from "./components/ToggleButtons";
import menMoviesIds from "./constants/movieIds";
import { updateSearchCount } from "./appwrite";

const API_BASE_URl = "https://api.themoviedb.org/3";

// Take the API key from .env.local file
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Given the options to the request
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [menMovies, setMenMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState("all");
  // new state for debounce search term

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URl}/search/movie?query=${query}`
        : `${API_BASE_URl}/discover/movie?sort_by=popularity.desc`;

      // fetch(url, options)
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // .json(): Parse the response body as JSON
      const data = await response.json();

      // If the server is down or something
      if (data.Response == "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovies([]);
        return;
      }

      setMovies(data.results || []);

      updateSearchCount();
    } catch (err) {
      setErrorMessage(`Error fetching movies. Please try again later.`);
      console.log(`Error fetching movies: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const movieIds = [
        550,
        1402,
        1366,
        51876,
        ...menMoviesIds.fearlessLeader,
        ...menMoviesIds.powerStrategy,
        ...menMoviesIds.confidenceTactics,
        ...menMoviesIds.businessHustle,
      ]; // Add more ID
      // console.log(movieIds);

      // Map over movieIds and create an array of fetch promises
      const moviePromises = movieIds.map(async (id) => {
        const response = await fetch(
          `${API_BASE_URl}/movie/${id}`,
          API_OPTIONS
        );
        if (!response.ok) throw new Error("Network response was not ok");

        return response.json();
      });

      // Wait for all promises to resolve
      const movies = await Promise.all(moviePromises);

      // Update state with all movies at once
      setMenMovies(movies || []);
    } catch (err) {
      setErrorMessage(`Error fetching movies. Please try again later.`);
      console.log(`Error fetching movies: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch movies when search term changes, with debounce to optimize
  useEffect(() => {
    // console.log(API_KEY);
    fetchMovies("");

    const delay = setTimeout(() => {
      // Only set loading when debounce finishes
      setIsLoading(true);

      fetchMovies(searchTerm);

      // Stop loading after fetching
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Fetch men's recommended movies on mount
  useEffect(() => {
    fetchMenMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" />

          <h1>
            Find <span className="text-gradient">Trending Movies</span> You Love
            With CineSeek
          </h1>

          <div
            style={{ visibility: activeView == "men" ? "hidden" : "visible" }}
          >
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </header>

        <ToggleButtons view={activeView} setView={setActiveView} />

        {activeView == "men" ? (
          <section className="all-movies">
            <h2 className="mt-[40px]">Recommended for Men</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {menMovies.map((movie) => (
                  <MovieCard movie={movie} key={movie.id} />
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard movie={movie} key={movie.id} />
                ))}
              </ul>
            )}

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </section>
        )}
      </div>
    </main>
  );
};

export default App;
