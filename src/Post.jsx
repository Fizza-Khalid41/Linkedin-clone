import React, { useState, forwardRef } from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import InputOption from "./InputOption";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const Post = forwardRef(({ name, description, message, photoUrl }, ref) => {
  // state for like and comment
  const [liked, setLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // handlers
  const handleLike = () => {
    setLiked(!liked);
  };

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentPost = () => {
    if (comment.trim() !== "") {
      setComments([comment, ...comments]);
      setComment("");
    }
  };

  return (
    <div ref={ref} className="post">
      <div className="post__header">
        <Avatar src={photoUrl}>{name[0]}</Avatar>
        <div className="post__info">
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="post__body">
        <p>{message}</p>
      </div>

      <div className="post__buttons">
        {/* Like Button */}
        <InputOption
          Icon={ThumbUpAltOutlinedIcon}
          title="Like"
          color={liked ? "blue" : "gray"}
          onClick={handleLike}
        />

        {/* Comment Button */}
        <InputOption
          Icon={CommentOutlinedIcon}
          title="Comment"
          color="gray"
          onClick={handleCommentClick}
        />

        <InputOption Icon={ShareOutlinedIcon} title="Share" color="gray" />
        <InputOption Icon={SendOutlinedIcon} title="Send" color="gray" />
      </div>

      {/* Comment box */}
      {showCommentBox && (
        <div className="commentBox">
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleCommentPost}>Post</button>
        </div>
      )}

      {/* Show comments */}
      {comments.length > 0 && (
        <div className="commentsList">
          {comments.map((c, i) => (
            <p key={i} className="comment">{c}</p>
          ))}
        </div>
      )}
    </div>
  );
});

export default Post;
