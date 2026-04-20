import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Avatar } from "@mui/material";
import InputOption from "./InputOption";
import ImageIcon from "@mui/icons-material/Image";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import Post from "./Post";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import FlipMove from "react-flip-move";
import axios from "axios";

function Feed() {
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  // Token lo localStorage se
  const token = localStorage.getItem("token");

  // Posts fetch karo Django se
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/posts/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setPosts(res.data))
    .catch(err => console.log(err));
  }, []);

  // Naya post Django mein save karo
  const sendPost = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/posts/create/", {
        content: input,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Naya post list mein add karo
      setPosts([res.data, ...posts]);
      setInput("");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="feed">
      <div className="feed__inputContainer">
        <div className="feed__inputRow">
          <Avatar className="feed__avatar" />
          <div className="feed__input">
            <form onSubmit={sendPost}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Start a post"
              />
              <button type="submit" style={{ display: "none" }}></button>
            </form>
          </div>
        </div>

        <div className="feed__inputOption">
          <InputOption Icon={SubscriptionsIcon} title="Video" color="#E7A33E" />
          <InputOption Icon={ImageIcon} title="Photo" color="#70B5F9" />
          <InputOption
            Icon={CalendarViewDayIcon}
            title="Write article"
            color="#7FC15E"
          />
        </div>
      </div>

      {/* Posts dikhao */}
      <FlipMove>
        {posts.map((post) => (
  <Post
    key={post.id}
    id={post.id}
    name={post.author}
    description={post.email}
    message={post.content}
    photoUrl=""
  />
))}
      </FlipMove>
    </div>
  );
}

export default Feed;