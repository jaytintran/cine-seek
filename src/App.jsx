import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = `${API_BASE_URl}/discover/movie?sort_by=popularity.desc`;

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
    } catch (err) {
      setErrorMessage(`Error fetching movies. Please try again later.`);
      console.log(`Error fetching movies: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(API_KEY);
    fetchMovies();
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

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <p key={movie.id} className="text-white">
                  {movie.title}
                </p>
              ))}
            </ul>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  );
};

export default App;
