import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
/* eslint-disable react/prop-types */
const MovieDetails = ({ movie, onBack }) => {
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    if (!movie) return;
    const fetchTrailer = async () => {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
        API_OPTIONS
      );
      const json = await data.json();
      //   console.log(json);

      // Find the trailer video
      let officalTrailer = json.results.find(
        (video) => video.name === "Official Trailer"
      );
      if (officalTrailer) {
        setTrailer(officalTrailer.key);
      } else {
        officalTrailer = json.results[0];
        setTrailer(officalTrailer.key);
      }
    };
    fetchTrailer();
  }, [movie]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-[hsla(0,0%,0%,0.5)] flex justify-center items-center z-50"
      onClick={onBack}
    >
      {/* <div
        className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-[600px] relative"
        onClick={(e) => e.stopPropagation()}
      > */}
      <div
        className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10 max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onBack}
          className="self-end mb-5 text-light-100 hover:text-light-200 transition duration-200 font-bold text-lg"
        >
          ← Back
        </button>
        {!trailer && (
          <img
            src={`https://image.tmdb.org/t/p/w500/${
              movie.backdrop_path || movie.poster_path
            }`}
            alt={movie.title}
            className="rounded-lg w-full object-cover"
          />
        )}
        {trailer && (
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${trailer}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
        <h2 className="mt-4 text-3xl font-bold text-light-100">
          {movie.title}
        </h2>
        <p className="mt-2 text-gray-100">
          <strong>Release Date:</strong> {movie.release_date}
        </p>
        <p className="mt-2 text-light-200 leading-relaxed">
          <strong>Overview:</strong> {movie.overview}
        </p>
        {/* <p className="mt-2 text-gray-100">
          <strong>Actors:</strong> {movie.actors}
        </p> */}
        <p className="mt-2 flex items-center gap-2">
          <span className="flex gap-2 text-lg font-bold text-light-100">
            <img src="star-icon.svg" /> {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-gray-100">/10</span>
        </p>
      </div>
      {/* </div> */}
    </div>
  );
};

export default MovieDetails;
