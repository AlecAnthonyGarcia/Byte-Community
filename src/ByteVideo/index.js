import React from "react";
import "./style.scss";

import moment from "moment";

class ByteVideo extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      isVideoPlaying: false
    };
  }

  onVideoClick = e => {
    e.preventDefault();
    const { index, currentIndex } = this.props;
    const { isVideoPlaying } = this.state;

    const { current: video } = this.videoRef;

    if (index === currentIndex) {
      if (video.paused && !isVideoPlaying) {
        video.play();
        this.setState({ isVideoPlaying: true });
      } else {
        video.pause();
        this.setState({ isVideoPlaying: false });
      }
    }
  };

  onPause = () => {
    const { current: video } = this.videoRef;

    if (!video.paused) {
      video.pause();
    }

    this.setState({ isVideoPlaying: false });
  };

  render() {
    const { index, post, author } = this.props;
    const {
      authorID,
      videoSrc,
      thumbSrc,
      date,
      caption,
      comments,
      commentCount,
      likeCount,
      loopCount
    } = post;
    const { avatarURL, username } = author;

    return (
      <div className="video-container">
        <div className="video-info-container">
          <div className="video-caption">{caption}</div>
          <span className="user-info-container">
            <img className="user-avatar" src={avatarURL} alt="" />
            <span className="user-username">{username}</span>
            <span className="timestamp">{moment.unix(date).fromNow()}</span>
          </span>
        </div>
        <video
          ref={this.videoRef}
          id={`byte-video-${index}`}
          className="byte-video"
          src={videoSrc}
          onClick={this.onVideoClick}
          onPause={this.onPause}
          loop
        />
      </div>
    );
  }
}

export default ByteVideo;
