import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VideoItem = ({ video }) => {
  const { createdAt, user_id, thumbnailUrl, title, duration, views } = video;
  const [postedDate, setPostedDate] = useState("");
  const [channelDetails, setChannelDetails] = useState(null);
  const navigate = useNavigate();

  // Function to calculate time ago
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const timestamp = new Date(createdAt);
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    // Time intervals in seconds
    const intervals = {
      year: 365 * 24 * 60 * 60,
      month: 30 * 24 * 60 * 60,
      day: 24 * 60 * 60,
      hour: 60 * 60,
      minute: 60,
      second: 1,
    };

    // Calculate the time difference
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }

    return "just now";
  };

  // Update posted date
  useEffect(() => {
    const postedAt = getTimeAgo(createdAt);
    setPostedDate(postedAt);
  }, [createdAt]);

  // Fetch channel details using user_id
  useEffect(() => {
    if (!user_id) return;

    fetch(`http://localhost:3000/user/${user_id}`) // Replace with your backend API endpoint
      .then((response) => response.json())
      .then((data) => {
        setChannelDetails({
          name: data.channelName,
          logo: data.logoUrl,
        });
      })
      .catch((error) =>
        console.error("Error fetching channel details:", error)
      );
  }, [user_id]);
  const videoClickHandler = (id) => {
    navigate(`/watch/${id}`);
  };
  return (
    <a className="group" href="#">
      <div className="relative">
        <img
          className="rounded-lg aspect-video"
          src={thumbnailUrl}
          alt={title}
        />
        <p className="absolute bottom-2 right-2 text-sm bg-black bg-opacity-50 text-white px-1.5 font-medium rounded-md">
          {duration}
        </p>
      </div>

      <div className="flex gap-3 py-3 px-2">
        {channelDetails && (
          <img
            className="h-9 w-9 rounded-full"
            src={channelDetails.logo}
            alt={channelDetails.name}
          />
        )}
        <div>
          <h2
            className="group-hover:text-blue-500 font-semibold leading-snug line-clamp-2 dark:text-neutral-300"
            title={title}
            onClick={() => videoClickHandler(video._id)}
          >
            {title}
          </h2>
          {channelDetails && (
            <p className="text-sm mt-1 text-neutral-700 hover:text-neutral-500 dark:text-neutral-300">
              {channelDetails.name}
            </p>
          )}
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {views} Views • {postedDate}
          </p>
        </div>
      </div>
    </a>
  );
};

export default VideoItem;
