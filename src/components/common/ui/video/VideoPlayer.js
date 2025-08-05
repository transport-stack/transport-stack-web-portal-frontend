import React from "react";

const VideoPlayer = ({ videoUrl, width, height, autoPlay=false }) => {
  return (
    <div>
      <video className="video_play" width={width} height={height} controls autoPlay={autoPlay}>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video
      </video>
    </div>
  );
};

export default VideoPlayer;
