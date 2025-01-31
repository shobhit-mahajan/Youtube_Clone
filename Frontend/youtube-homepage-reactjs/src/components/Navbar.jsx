import { Menu, Mic, MoonStar, Search, Sun } from "lucide-react";
import Logo from "../assets/youtube.png";
import { useEffect, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const Navbar = ({ toggleSidebar, setSearchResults }) => {
  const { user, logout } = useAuth(); // Access user and logout from AuthContext
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to toggle dropdown
  const [query, setQuery] = useState(""); // Search query state

  useEffect(() => {
    document.body.classList[isDarkMode ? "add" : "remove"]("dark");
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return; // Prevent search with empty query

    fetch(`http://localhost:3000/video/search?query=${query}`) // Adjust endpoint for search
      .then((response) => response.json())
      .then((data) => {
        if (data.videos) {
          setSearchResults(data.videos); // Update search results on HomePage
        } else {
          setSearchResults([]); // Reset if no videos found
        }
      })
      .catch((error) => {
        console.error("Error searching videos:", error);
        setSearchResults([]); // Reset on error
      });
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900">
      <nav className="flex items-center justify-between py-2 pb-5 px-4">
        {/* Left section */}
        <HeaderLeftSection toggleSidebar={toggleSidebar} />

        {/* Search input */}
        <div className="h-10 flex gap-3 w-[600px] max-lg:w-[500px] max-md:hidden">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-neutral-300 w-full h-full rounded-l-full px-4 outline-none focus:border-blue-500 dark:bg-neutral-900 dark:border-neutral-500 dark:focus:border-blue-500 dark:text-neutral-300"
              type="search"
              placeholder="Search"
              required
            />
            <button className="border border-neutral-300 px-5 border-l-0 rounded-r-full hover:bg-neutral-100 dark:border-neutral-500 hover:dark:bg-neutral-700">
              <Search className="dark:text-neutral-400" />
            </button>
          </form>
          <button className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700">
            <Mic className="dark:text-neutral-400" />
          </button>
        </div>

        {/* User and dark mode toggle */}
        <div className="flex items-center gap-4 relative">
          <button className="p-2 rounded-full md:hidden hover:bg-neutral-200 hover:dark:bg-neutral-700">
            <Search className="dark:text-neutral-400" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-neutral-200 hover:dark:bg-neutral-700"
          >
            {isDarkMode ? (
              <Sun className="dark:text-neutral-400" />
            ) : (
              <MoonStar className="dark:text-neutral-400" />
            )}
          </button>

          {user ? (
            <div className="relative">
              <img
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-8 h-8 rounded-full cursor-pointer"
                src={user.logoUrl || "https://via.placeholder.com/150"}
                alt={user.channelName || "User Avatar"}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-neutral-800 z-30">
                  <a
                    href={`/channel/${user._id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    View Channel
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Settings
                  </a>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="text-sm font-medium px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Login
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};

export const HeaderLeftSection = ({ toggleSidebar }) => {
  return (
    <div className="flex gap-4 items-center z-10">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-full hover:bg-neutral-200 hover:dark:bg-neutral-700"
      >
        <Menu className="dark:text-neutral-400" />
      </button>
      <a className="flex items-center gap-2" href="/">
        <img
          src={Logo}
          width={32}
          alt="Logo"
        />
        <h2 className="text-xl font-bold dark:text-neutral-300">
          InternShalaTube
        </h2>
      </a>
    </div>
  );
};

export default Navbar;
