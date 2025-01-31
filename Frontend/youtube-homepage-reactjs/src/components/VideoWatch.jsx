import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SlLike, SlDislike } from "react-icons/sl";

const VideoWatch = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [videoDetails, setVideoDetails] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/video/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        setVideoDetails(data.video);
        setRecommendedVideos(data.recommendedVideos || []);
        setLikes(data.video.likes || 0);
        setDislikes(data.video.dislikes || 0);
      });

    fetch(`http://localhost:3000/user/views/${videoId}`, {
      method: "PUT",
    }).catch((err) => console.error(err));

    fetchComments();
  }, [videoId]);

  useEffect(() => {
    if (videoDetails) {
      fetch(`http://localhost:3000/user/${videoDetails.user_id}`)
        .then((res) => res.json())
        .then((data) => {
          setUserDetail({
            name: data.channelName,
            logo: data.logoUrl,
            subscribers: data.subscribers,
            isSubscribed: data.isSubscribed,
          });
        })
        .catch((error) =>
          console.error("Error fetching channel details:", error)
        );
    }
  }, [videoDetails]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/comment/${videoId}`);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!loggedInUser) {
      alert("You need to be logged in to comment.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/comment/new-comment/${videoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUser.token}`,
          },
          body: JSON.stringify({
            user_id: loggedInUser._id,
            commentText: newComment,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setNewComment("");
      } else {
        console.error("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    if (!loggedInUser) return alert("You need to be logged in to delete a comment.");

    try {
      const response = await fetch(`http://localhost:3000/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
    // Handle editing a comment
    const handleEditComment = async (commentId, newCommentText) => {
      if (!loggedInUser) return alert("You need to be logged in to edit a comment.");
  
      try {
        const response = await fetch(`http://localhost:3000/comment/${commentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUser.token}`,
          },
          body: JSON.stringify({ commentText: newCommentText }),
        });
  
        if (response.ok) {
          const updatedComments = comments.map((comment) =>
            comment._id === commentId ? { ...comment, commentText: newCommentText } : comment
          );
          setComments(updatedComments);
        }
      } catch (error) {
        console.error("Error editing comment:", error);
      }
    };

  const handleSubscribe = async () => {
    if (!loggedInUser) {
      alert("You need to be logged in to subscribe.");
      return;
    }

    const url = userDetail?.isSubscribed
      ? `http://localhost:3000/user/unsubscribe/${videoDetails.user_id}`
      : `http://localhost:3000/user/subscribe/${videoDetails.user_id}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (response.ok) {
        setUserDetail((prev) => ({
          ...prev,
          isSubscribed: !prev.isSubscribed,
          subscribers: prev.isSubscribed
            ? prev.subscribers - 1
            : prev.subscribers + 1,
        }));
      }
    } catch (error) {
      console.error("Error subscribing/unsubscribing:", error);
    }
  };

  const handleLike = async () => {
    if (!loggedInUser) {
      alert("You need to be logged in to like a video.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/video/like/${videoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUser.token}`,
          },
          body: JSON.stringify({ userId: loggedInUser._id }),
        }
      );

      if (response.ok) {
        setLikes((prev) => (userReaction === "like" ? prev - 1 : prev + 1));
        setDislikes((prev) => (userReaction === "dislike" ? prev - 1 : prev));
        setUserReaction(userReaction === "like" ? null : "like");
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    if (!loggedInUser) {
      alert("You need to be logged in to dislike a video.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/video/dislike/${videoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUser.token}`,
          },
          body: JSON.stringify({ userId: loggedInUser._id }),
        }
      );

      if (response.ok) {
        setDislikes((prev) =>
          userReaction === "dislike" ? prev - 1 : prev + 1
        );
        setLikes((prev) => (userReaction === "like" ? prev - 1 : prev));
        setUserReaction(userReaction === "dislike" ? null : "dislike");
      }
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };

  if (!videoDetails) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen dark:bg-neutral-900">
      <Navbar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        setSearchResults={setSearchResults}
      />
      <div className="flex flex-1">
        <Sidebar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex flex-1 flex-col md:flex-row mt-6 px-6 space-y-6 md:space-y-0">
          <div className="w-full md:w-2/3 pr-6">
            <video
              controls
              src={videoDetails.videoUrl}
              className="w-full rounded-lg"
              autoPlay
            />
            <h1 className="text-2xl font-bold mt-4">{videoDetails.title}</h1>
            <div className="flex items-center mt-2">
              <img
                src={userDetail?.logo || "default-icon.png"}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p
                  className="font-semibold text-lg cursor-pointer"
                  onClick={() => navigate(`/channel/${videoDetails.user_id}`)}
                >
                  {userDetail?.name}
                </p>
                <p className="text-gray-500">
                  {userDetail?.subscribers} subscribers
                </p>
              </div>
              <button
                className={`px-6 py-2 rounded-full ml-auto ${
                  userDetail?.isSubscribed
                    ? "bg-gray-400"
                    : "bg-black text-white"
                }`}
                onClick={handleSubscribe}
              >
                {userDetail?.isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full bg-gray-200" onClick={handleLike}>
                   <SlLike/>{likes}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full bg-gray-200" onClick={handleDislike}>
                  <SlDislike/> {dislikes}
                  </button>
            </div>
            <p className="mt-2">
              {videoDetails.views} Views •{" "}
              {new Date(videoDetails.createdAt).toLocaleDateString()}
            </p>
              {/* Video Description */}
              <div className="description-content bg-gray-200 py-5 px-5 my-10 rounded-xl">
              <p className="mt-2 text-md font-bold">{videoDetails.views} Views • {new Date(videoDetails.createdAt).toLocaleDateString()}</p>
              <p className="mt-4">{videoDetails.description}</p>
            </div>
                    {/* Comment Section */}
                    <div className="commentSection my-3">
              <h2 className="m-2 font-bold text-2xl">Comments</h2>
              <div className="comment flex items-center gap-4">
                <input
                  type="text"
                  className="outline-none border-b-2 border-b-gray my-2 px-1 py-2 w-full"
                  placeholder="Add a public comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="py-2 px-5 rounded-full bg-gray-300" onClick={handleAddComment}>
                  Comment
                </button>
              </div>
            </div>

            {/* Display Comments */}
            <div className="commentSection">
              {comments.map((comment) => (
                <div className="comment flex items-center gap-4 p-2 border-b border-gray-300">
                  <img src={comment.user_id?.logoUrl || "default-icon.png"} alt="User Icon" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold">{comment.user_id?.channelName || "Unknown User"}</p>
                    <p>{comment.commentText}</p>
                   {
                   (loggedInUser?._id == comment?.user_id?._id && 
                   <div className="btn flex items-center gap-4 my-2">
                   <button onClick={()=>handleEditComment(comment._id,prompt("Edit Comment",comment.commentText))} className="px-8 py-1 bg-gray-300 rounded-lg">Edit</button>
                   <button onClick={()=>handleDeleteComment(comment._id)} className="px-8 py-1 bg-red-500 rounded-lg text-white ">Delete</button>
                   </div>
                    
                   
               ) }
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
  );
};

export default VideoWatch;
