import React, { useState, forwardRef , useEffect} from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import InputOption from "./InputOption";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import axios from "axios";

const Post = forwardRef(({ id, name = "", description = "", message = "", photoUrl = "" }, ref) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
  axios.get(`http://127.0.0.1:8000/api/posts/${id}/comments/`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((res) => setComments(res.data.map(c => c.content)))
  .catch(console.error);
}, []);



  
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/posts/${id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(!liked);
      setLikesCount(res.data.likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  

const handleCommentPost = async () => {
  if (comment.trim() === "") return;
  try {
    await axios.post(
      `http://127.0.0.1:8000/api/posts/${id}/comment/`,
      { content: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComment("");


    const res = await axios.get(
      `http://127.0.0.1:8000/api/posts/${id}/comments/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComments(res.data.map(c => c.content));

  } catch (error) {
    console.log(error);
  }
};

  return (
    <div ref={ref} className="post">
      <div className="post__header">
        <Avatar src={photoUrl}>{name?.[0]}</Avatar>
        <div className="post__info">
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="post__body">
        <p>{message}</p>
      </div>

      <div className="post__buttons">
        <InputOption
          Icon={ThumbUpAltOutlinedIcon}
          title={`Like ${likesCount > 0 ? likesCount : ""}`}
          color={liked ? "blue" : "gray"}
          onClick={handleLike}
        />
        <InputOption
          Icon={CommentOutlinedIcon}
          title="Comment"
          color="gray"
          onClick={handleCommentClick}
        />
        <InputOption Icon={ShareOutlinedIcon} title="Share" color="gray" />
        <InputOption Icon={SendOutlinedIcon} title="Send" color="gray" />
      </div>

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