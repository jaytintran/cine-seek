/* eslint-disable react/prop-types */
function MovieCard({
  movie: { title, vote_average, poster_path, release_date, original_language },
  onClick,
}) {
  return (
    <li className="movie-card" onClick={onClick}>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-poster-vertical.png"
        }
        alt={title}
      />
      <section className="mt-5">
        <h3 className="text-white">{title}</h3>

        {/* Content Box */}
        <div className="content">
          <div className="rating">
            <img src="/star-icon.svg" alt="star" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>🔹</span>
          <span>{original_language.toUpperCase()}</span>
          <span>🔹</span>
          <p className="year">
            {release_date ? release_date.slice(0, 4) : "N/A"}
          </p>
        </div>
      </section>
    </li>
  );
}

export default MovieCard;
