/* eslint-disable react/prop-types */
const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center md:w-1/3 w-full">
      <div className="flex items-center px-4 py-2 w-full rounded-md bg-light-100/5">
        <img src="look-up.svg" alt="search" />

        <input
          type="text"
          placeholder="Search through 1000+ movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-base text-gray-200 w-full py-3 pl-5 outline-none"
        />
      </div>
    </div>
  );
};

export default Search;
