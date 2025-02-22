/* eslint-disable react/prop-types */
const ToggleButtons = ({ view, setView }) => {
  return (
    <div className="flex gap-4 mb-10 md:mb-0">
      <button
        className={`px-4 cursor-pointer py-3 rounded-md ${
          view === "all"
            ? "bg-linear-to-r from-[#00C7FF] to-[#AB8BFF] text-white"
            : "bg-gray-300"
        }`}
        onClick={() => setView("all")}
      >
        All Movies
      </button>
      <button
        className={`px-4 cursor-pointer py-3 rounded-md ${
          view === "men"
            ? "bg-linear-to-r from-[#00C7FF] to-[#AB8BFF] text-white"
            : "bg-gray-300"
        }`}
        onClick={() => setView("men")}
      >
        Recommended for Men
      </button>
    </div>
  );
};

export default ToggleButtons;
