import React from "react";
import "./style.scss";

const User = props => {
  const { user } = props;
  const {
    avatarURL,
    bio,
    username,
    displayName,
    backgroundColor,
    foregroundColor
  } = user;

  return (
    <div
      className="user-container"
      style={{ background: backgroundColor, color: foregroundColor }}
    >
      <div className="user-info-container">
        <img className="user-avatar" src={avatarURL} alt="" />
        <h1 style={{ color: foregroundColor }} className="user-display-name">
          {displayName}
        </h1>
        <span className="user-username">{username}</span>
        <p className="user-bio">{bio}</p>
      </div>
    </div>
  );
};

export default User;
