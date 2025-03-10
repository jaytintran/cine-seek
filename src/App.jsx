import { useState, useEffect } from "react";
import Search from "./components/Search";
import ToggleButtons from "./components/ToggleButtons";
import menMoviesIds from "./constants/movieIds";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import MovieDetails from "./components/MovieDetails";
import AllMovies from "./components/AllMovies";

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
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [activeView, setActiveView] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);

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

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
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

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (err) {
      console.log(`Error fetching movies: ${err}`);
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

  // Fetch trending and men's recommended movies on mount
  useEffect(() => {
    fetchTrendingMovies();
    fetchMenMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            onBack={() => setSelectedMovie(null)}
          />
        )}
        <>
          <header>
            <img src="./hero-img.png" />

            <div>
              <img src="./logo.png" className="w-[200px] md:w-[300px]" />
            </div>
            <h1>
              Find <span className="text-gradient">Trending Movies</span> You
              Love With CineSeek
            </h1>

            <div
              style={{
                visibility: activeView == "men" ? "hidden" : "visible",
              }}
            >
              {/* <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
            </div>
          </header>

          {trendingMovies.length > 0 ? (
            <section className="trending mt-[40px]">
              <h2>Most Searched</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={index}>
                    <p>{index + 1}</p>
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.posterUrl}`}
                      alt={movie.movieTitle}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="flex align-center justify-between md:flex-row flex-col mt-[40px]">
            <ToggleButtons view={activeView} setView={setActiveView} />
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          {activeView == "men" ? (
            <AllMovies
              movies={menMovies}
              setSelectedMovie={setSelectedMovie}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          ) : (
            <AllMovies
              movies={movies}
              setSelectedMovie={setSelectedMovie}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          )}
        </>
      </div>
    </main>
  );
};

export default App;
