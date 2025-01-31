import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CategoryPill from "./CategoryPill";
import VideoItem from "./VideoItem";
import { categories } from "../constants/index";
import { useAuth } from "../context/AuthContext";

export const HomePage = () => {
  const { user } = useAuth() || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // Holds search results
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (user) {
      const url =
        activeCategory !== "All"
          ? `http://localhost:3000/video/search?query=${encodeURIComponent(
              activeCategory
            )}` // Fetch based on category
          : "http://localhost:3000/video"; // Fetch all videos

      fetch(url)
        .then((response) => response.json())
        .then((data) => setVideos(data.videos || [])) // Update videos state
        .catch((error) => console.error("Error fetching videos:", error));
    }
  }, [activeCategory, user]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Hide sidebar initially on large screens
  useEffect(() => {
    if (window.innerWidth >= 768) setIsSidebarOpen(true);
  }, []);

  // If there are search results, show them; otherwise, show category videos
  const videosToDisplay = searchResults.length > 0 ? searchResults : videos;
  console.log(searchResults);
  return (
    <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-900">
      <Navbar
        toggleSidebar={toggleSidebar}
        setSearchResults={setSearchResults}
      />
      <div className="flex overflow-auto">
        <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Mobile Sidebar Overlay */}
        <div
          onClick={toggleSidebar}
          className={`md:hidden ${
            !isSidebarOpen && "opacity-0 pointer-events-none"
          } transition-all bg-black bg-opacity-50 h-screen w-full fixed left-0 top-0 z-20`}
        ></div>

        <div
          className={`w-full px-4 overflow-x-hidden custom_scrollbar ${
            isSidebarOpen && "hide_thumb"
          }`}
        >
          {/* Category List */}
          <div className="sticky bg-white top-0 pb-3 flex gap-3 overflow-y-auto no_scrollbar dark:bg-neutral-900">
            {categories.map((category) => (
              <CategoryPill
                key={category}
                category={category}
                onCategoryClick={setActiveCategory}
                activeCategory={activeCategory}
              />
            ))}
          </div>

          {/* Video Grid */}
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-5 pb-6">
            {user ? (
              videosToDisplay.length > 0 ? (
                videosToDisplay.map((video) => (
                  <VideoItem key={video.id} video={video} />
                ))
              ) : (
                <p>No videos found</p>
              )
            ) : (
              <p className="text-center rounded-lg shadow-lg absolute left-[30%] bg-gray-100 w-1/2 px-20 py-10">
                Please log in or sign up to view videos
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
