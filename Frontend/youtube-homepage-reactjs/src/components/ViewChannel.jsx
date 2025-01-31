import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import VideoItem from "./VideoItem";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewChannel = () => {
  // State variables to manage data and modal states
  const [videos, setVideos] = useState([]); // Stores video list
  const [channelOwner, setChannelOwner] = useState(false); // Tracks if the user owns the channel
  const [loggedInUser, setLoggedInUser] = useState(null); // Stores logged-in user's token
  const [userId, setUserId] = useState(); // Stores the logged-in user's ID
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // open or lcose sidenavbar
  const [videoData, setVideoData] = useState({
    // Stores data for video being uploaded or edited
    title: "",
    description: "",
    category: "",
    tags: "",
    video: null,
    thumbnail: null,
  });
  const [editingVideo, setEditingVideo] = useState(null); // Tracks video being edited
  const [activeTab, setActiveTab] = useState("videos"); // Active tab state
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility state
  const [channelDetail, setChannelDetail] = useState(null); // Channel details

  const { channelId } = useParams(); // Channel ID from URL params

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Fetch user data from local storage when the component mounts
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setLoggedInUser(userData.token); // Store token
      setUserId(userData._id); // Store user ID
    }
  }, []);

  // Fetch videos and channel details when component or channelId changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/video?user_id=${channelId}`
        );
        setVideos(res.data.videos);

        // Check if the logged-in user owns the channel
        if (
          res.data.videos.length > 0 &&
          res.data.videos[0].user_id === userId
        ) {
          setChannelOwner(true);
        }
      } catch (error) {
        console.error("Error fetching videos", error);
      }
    };

    const fetchChannel = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/user/${channelId}`);
        setChannelDetail(res.data); // Set channel detail on successful fetch
      } catch (error) {
        console.log("Error while fetching channel details");
      }
    };

    fetchVideos();
    fetchChannel();
  }, [channelId, loggedInUser]); // Dependency array ensures these effects run when the channelId or logged-in user changes

  // Handle file input changes for video and thumbnail files
  const handleFileChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.files[0] });
  };

  // Handle changes in input fields (title, description, etc.)
  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  // Handle form submission for video upload or edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("description", videoData.description);
    formData.append("category", videoData.category);
    formData.append("tags", videoData.tags);
    if (videoData.video) formData.append("video", videoData.video);
    if (videoData.thumbnail) formData.append("thumbnail", videoData.thumbnail);

    try {
      // If editing an existing video
      if (editingVideo) {
        const res = await axios.put(
          `http://localhost:3000/video/${editingVideo}`,
          formData,
          {
            headers: { Authorization: `Bearer ${loggedInUser}` },
          }
        );
        setVideos(
          videos.map((video) =>
            video._id === editingVideo ? res.data.video : video
          )
        );
        setEditingVideo(null);
      } else {
        // If uploading a new video
        const res = await axios.post(
          "http://localhost:3000/video/upload",
          formData,
          {
            headers: { Authorization: `Bearer ${loggedInUser}` },
          }
        );
        setVideos([...videos, res.data.video]);
      }
      alert(
        editingVideo
          ? "Video updated successfully!"
          : "Video uploaded successfully!"
      );
      setModalOpen(false); // Close the modal
      setVideoData({
        title: "",
        description: "",
        category: "",
        tags: "",
        video: null,
        thumbnail: null,
      });
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  // Handle video edit action
  const handleEdit = (video) => {
    setEditingVideo(video._id);
    setVideoData({
      title: video.title,
      description: video.description,
      category: video.category,
      tags: video.tags.join(", "),
      video: null,
      thumbnail: null,
    });
    setModalOpen(true); // Open modal for editing
  };

  // Handle video delete action
  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`http://localhost:3000/video/${videoId}`, {
        headers: { Authorization: `Bearer ${loggedInUser}` },
      });
      setVideos(videos.filter((video) => video._id !== videoId));
      alert("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video", error);
    }
  };

  // Open modal for uploading new video
  const handleOpenModal = () => {
    setModalOpen(true); // Open modal
    setEditingVideo(null); // Reset editing state
    setVideoData({
      title: "",
      description: "",
      category: "",
      tags: "",
      video: null,
      thumbnail: null,
    });
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalOpen(false); // Close modal
  };

  return (
    <div className="relative">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="header absolute top-20 z-20 w-full h-1/2">
        <div className="thumbnail w-3/4 h-40 m-auto my-2 rounded-xl">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTYH344DvmYQnC1rB6Xe0psRNECuKfp626ag&s"
            alt="Channel Thumbnail"
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="channel-detail flex items-center gap-6">
            <div className="logo rounded-full w-32 h-32 border flex items-center justify-center">
              {/* Display channel logo, fallback to 'No Logo' if not available */}
              {channelDetail && channelDetail.logoUrl ? (
                <img
                  src={channelDetail.logoUrl}
                  alt="Channel Logo"
                  className="w-32 h-32 object-cover rounded-full"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded-full">
                  No Logo
                </div>
              )}
            </div>
            <div className="channelName my-5">
              <h2 className="p-2 font-bold text-2xl">
                {channelDetail?.channelName}
              </h2>
              <p className="text-gray-500">
                {channelDetail?.user?.subscribers} Subscribers
              </p>
            </div>
            {/* Show Subscribe button if the logged-in user is not the channel owner */}
            {!channelOwner && (
              <button className="bg-black text-white px-14 py-2 border-2 border-slate-200 rounded-full">
                Subscribe
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="tabs mt-5">
            <div className="flex justify-center gap-8">
              {["videos", "playlist", "about"].map((tab) => (
                <button
                  key={tab}
                  className={`text-lg ${
                    activeTab === tab ? "text-blue-600" : "text-gray-600"
                  } hover:text-blue-600`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <hr className="my-4" />
          </div>

          {/* Video Section */}
          {activeTab === "videos" && (
            <div className="video-section mt-5">
              <h3 className="text-xl font-bold mx-10">Videos</h3>
              <div className="video-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {videos.map((video) => (
                  <div key={video._id} className="relative">
                    <VideoItem video={video} />
                    {channelOwner && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(video._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleEdit(video)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="mt-6 bg-black text-white px-6 py-2 rounded-full block mx-auto"
                onClick={handleOpenModal}
              >
                Upload New Video
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {modalOpen && (
        <div className="modal-overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg w-3/4 md:w-1/2">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block font-bold">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={videoData.title}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block font-bold">
                  Description
                </label>
                <textarea
                  name="description"
                  value={videoData.description}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block font-bold">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={videoData.category}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tags" className="block font-bold">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={videoData.tags}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold">Video</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleFileChange}
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold">Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-2 rounded-full"
                >
                  {editingVideo ? "Update Video" : "Upload Video"}
                </button>
              </div>
            </form>
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-2xl text-gray-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewChannel;
