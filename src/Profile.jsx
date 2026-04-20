import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import "./Profile.css";

function Profile({ onBack }) {
  const user = useSelector(selectUser);
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  // Basic Info
  const [editBasic, setEditBasic] = useState(false);
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");

  // About
  const [editAbout, setEditAbout] = useState(false);
  const [bio, setBio] = useState("");

  // Experience
  const [editExp, setEditExp] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDate, setExpDate] = useState("");

  // Education
  const [editEdu, setEditEdu] = useState(false);
  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduDate, setEduDate] = useState("");

  // Skills
  const [editSkills, setEditSkills] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  // Sidebar
  const [editLang, setEditLang] = useState(false);
  const [profileLang, setProfileLang] = useState("English");
  const [editUrl, setEditUrl] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");

  // Activity
  const [userPosts, setUserPosts] = useState([]);

  // Featured
  const [featuredLinks, setFeaturedLinks] = useState([]);
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    
    axios
      .get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setBio(res.data.bio || "");
        setLocation(res.data.location || "");
        setHeadline(res.data.headline || "");
        setExpTitle(res.data.exp_title || "");
        setExpCompany(res.data.exp_company || "");
        setExpDate(res.data.exp_date || "");
        setEduSchool(res.data.edu_school || "");
        setEduDegree(res.data.edu_degree || "");
        setEduDate(res.data.edu_date || "");
        setSkills(res.data.skills ? res.data.skills.split(",") : []);
        setProfileLang(res.data.profile_language || "English");
        setPublicUrl(
          res.data.public_url ||
            `www.linkedin.com/in/${(user?.displayName || "user")
              .toLowerCase()
              .replace(/\s+/g, "-")}-${Math.floor(Math.random() * 900000000) + 100000000}`
        );
      })
      .catch((err) => console.log(err));

  
    axios.get("http://127.0.0.1:8000/api/posts/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const myPosts = res.data.filter(
          (post) => post.email === user?.email
        );
        setUserPosts(myPosts);
      })
      .catch((err) => console.log(err));
  }, []);

  const saveProfile = () => {
    axios.put( "http://127.0.0.1:8000/api/profile/update/",
        {
          bio,
          location,
          headline,
          exp_title: expTitle,
          exp_company: expCompany,
          exp_date: expDate,
          edu_school: eduSchool,
          edu_degree: eduDegree,
          edu_date: eduDate,
          skills: skills.join(","),
          profile_language: profileLang,
          public_url: publicUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => console.log("Profile saved!"))
      .catch((err) => console.log(err));
  };

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addFeaturedLink = () => {
    if (linkTitle.trim() && linkUrl.trim()) {
      setFeaturedLinks([...featuredLinks, { title: linkTitle, url: linkUrl }]);
      setLinkTitle("");
      setLinkUrl("");
      setShowAddLink(false);
    }
  };

  return (
    <div className="profile">
      <button className="profile__back" onClick={onBack}>
        ← Back to Feed
      </button>

      <div className="profile__layout">
        {/* ── MAIN COLUMN ── */}
        <div className="profile__main">

          {/* BASIC INFO */}
          <div className="profile__card">
            <div className="profile__cover"></div>
            <div className="profile__avatarRow">
              <Avatar className="profile__avatar">
                {user?.displayName?.[0]}
              </Avatar>
              <button
                className="profile__editBtn"
                onClick={() => setEditBasic(!editBasic)}
              >
                {editBasic ? "✕ Cancel" : "✏️ Edit"}
              </button>
            </div>

            <div className="profile__basicInfo">
              <h1>{user?.displayName}</h1>
              {editBasic ? (
                <>
                  <input
                    className="profile__input"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Headline"
                  />
                  <input
                    className="profile__input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                  />
                  <button
                    className="profile__saveBtn"
                    onClick={() => { saveProfile(); setEditBasic(false); }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h3>{headline || "Add your headline"}</h3>
                  <p>📍 {location || "Add location"}</p>
                </>
              )}
              <p className="profile__email">{user?.email}</p>
              <div className="profile__actionBtns">
                <button className="profile__actionBtn profile__actionBtn--primary">Open to</button>
                <button className="profile__actionBtn profile__actionBtn--outline">Add profile section</button>
                <button className="profile__actionBtn profile__actionBtn--outline">Enhance profile</button>
                <button className="profile__actionBtn profile__actionBtn--ghost">Resources</button>
              </div>
            </div>

            <div className="profile__stats">
              <div className="profile__stat">
                <span>{profile?.profile_viewers || 0}</span>
                <p>Profile viewers</p>
              </div>
              <div className="profile__stat">
                <span>{profile?.post_impressions || 0}</span>
                <p>Post impressions</p>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div className="profile__section">
            <div className="profile__sectionHeader">
              <h2>About</h2>
              <button className="profile__editBtn" onClick={() => setEditAbout(!editAbout)}>
                {editAbout ? "✕ Cancel" : "✏️ Edit"}
              </button>
            </div>
            {editAbout ? (
              <>
                <textarea
                  className="profile__textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people about yourself..."
                  rows={4}
                />
                <button className="profile__saveBtn" onClick={() => { saveProfile(); setEditAbout(false); }}>
                  Save
                </button>
              </>
            ) : (
              <p>{bio || "Add a bio to tell people about yourself"}</p>
            )}
          </div>

          

          {/* FEATURED */}
          <div className="profile__section">
            <div className="profile__sectionHeader">
              <h2>Featured</h2>
              <div className="profile__featuredBtns">
                <button
                  className="profile__editBtn"
                  onClick={() => setShowAddLink(!showAddLink)}
                >
                  + Add
                </button>
              </div>
            </div>

            {showAddLink && (
              <div className="profile__addLink">
                <input
                  className="profile__input"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Title (e.g. My GitHub)"
                />
                <input
                  className="profile__input"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="URL (e.g. github.com/username)"
                />
                <button className="profile__saveBtn" onClick={addFeaturedLink}>
                  Save Link
                </button>
              </div>
            )}

            <div className="profile__featuredCards">
              {featuredLinks.length === 0 ? (
                <p style={{ color: "gray", fontSize: "14px" }}>
                  Add links, posts, or media to feature
                </p>
              ) : (
                featuredLinks.map((item, index) => (
                  <div key={index} className="profile__featuredCard">
                    <p>{item.title}</p>
                    <span>{item.url}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="profile__section">
            <div className="profile__sectionHeader">
              <div>
                <h2>Activity</h2>
                <p className="profile__followers">
                  {profile?.profile_viewers || 0} followers
                </p>
              </div>
              <button className="profile__createPostBtn">
                + Create a post
              </button>
            </div>

            <div className="profile__activityPosts">
              {userPosts.length === 0 ? (
                <p className="profile__noActivity">
                  Recent posts will show up here
                </p>
              ) : (
                userPosts.map((post) => (
                  <div key={post.id} className="profile__activityPost">
                    <p>{post.content}</p>
                    <span>{post.created_at?.slice(0, 10)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          

          {/* EXPERIENCE */}
          <div className="profile__section">
            <div className="profile__sectionHeader">
              <h2>Experience</h2>
              <button className="profile__editBtn" onClick={() => setEditExp(!editExp)}>
                {editExp ? "✕ Cancel" : "✏️ Edit"}
              </button>
            </div>
            {editExp ? (
              <>
                <input className="profile__input" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder="Job Title" />
                <input className="profile__input" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Company Name" />
                <input className="profile__input" value={expDate} onChange={(e) => setExpDate(e.target.value)} placeholder="Jan 2023 - Present" />
                <button className="profile__saveBtn" onClick={() => { saveProfile(); setEditExp(false); }}>Save</button>
              </>
            ) : (
              <div className="profile__item">
                <Avatar className="profile__itemAvatar">{expCompany?.[0] || "C"}</Avatar>
                <div>
                  <h3>{expTitle || "Add job title"}</h3>
                  <p>{expCompany || "Add company"}</p>
                  <p className="profile__date">{expDate || "Add dates"}</p>
                </div>
              </div>
            )}
          </div>

          {/* EDUCATION */}
          <div className="profile__section">
            <div className="profile__sectionHeader">
              <h2>Education</h2>
              <button className="profile__editBtn" onClick={() => setEditEdu(!editEdu)}>
                {editEdu ? "✕ Cancel" : "✏️ Edit"}
              </button>
            </div>
            {editEdu ? (
              <>
                <input className="profile__input" value={eduSchool} onChange={(e) => setEduSchool(e.target.value)} placeholder="University/School Name" />
                <input className="profile__input" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="Degree" />
                <input className="profile__input" value={eduDate} onChange={(e) => setEduDate(e.target.value)} placeholder="2019 - 2023" />
                <button className="profile__saveBtn" onClick={() => { saveProfile(); setEditEdu(false); }}>Save</button>
              </>
            ) : (
              <div className="profile__item">
                <Avatar className="profile__itemAvatar">{eduSchool?.[0] || "U"}</Avatar>
                <div>
                  <h3>{eduSchool || "Add university"}</h3>
                  <p>{eduDegree || "Add degree"}</p>
                  <p className="profile__date">{eduDate || "Add dates"}</p>
                </div>
              </div>
            )}
          </div>

          {/* SKILLS */}
          <div className="profile__section">
            <div className="profile__sectionHeader">
              <h2>Skills</h2>
              <button className="profile__editBtn" onClick={() => setEditSkills(!editSkills)}>
                {editSkills ? "✕ Cancel" : "✏️ Edit"}
              </button>
            </div>
            {editSkills && (
              <div className="profile__skillInput">
                <input className="profile__input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Naya skill likho" />
                <button className="profile__addBtn" onClick={addSkill}>+ Add</button>
              </div>
            )}
            <div className="profile__skills">
              {skills.map((skill, index) => (
                <span key={index} className="profile__skill">
                  {skill}
                  {editSkills && (
                    <button className="profile__removeSkill" onClick={() => removeSkill(index)}>✕</button>
                  )}
                </span>
              ))}
            </div>
            {editSkills && (
              <button className="profile__saveBtn" onClick={() => { saveProfile(); setEditSkills(false); }}>Save</button>
            )}
          </div>

        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="profile__sidebar">
          <div className="profile__sideCard">
            <div className="profile__sideHeader">
              <h3>Profile language</h3>
              <button className="profile__sideEdit" onClick={() => setEditLang(!editLang)}>
                <EditIcon style={{ fontSize: 18 }} />
              </button>
            </div>
            {editLang ? (
              <>
                <select className="profile__input" value={profileLang} onChange={(e) => setProfileLang(e.target.value)}>
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Arabic</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
                <button className="profile__saveBtn" onClick={() => { saveProfile(); setEditLang(false); }}>Save</button>
              </>
            ) : (
              <p className="profile__sideText">{profileLang}</p>
            )}
          </div>

          <div className="profile__sideCard">
            <div className="profile__sideHeader">
              <h3>Public profile &amp; URL</h3>
              <button className="profile__sideEdit" onClick={() => setEditUrl(!editUrl)}>
                <EditIcon style={{ fontSize: 18 }} />
              </button>
            </div>
            {editUrl ? (
              <>
                <input className="profile__input" value={publicUrl} onChange={(e) => setPublicUrl(e.target.value)} placeholder="www.linkedin.com/in/your-name" />
                <button className="profile__saveBtn" onClick={() => { saveProfile(); setEditUrl(false); }}>Save</button>
              </>
            ) : (
              <a className="profile__sideLink" href={`https://${publicUrl}`} target="_blank" rel="noreferrer">
                {publicUrl}
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Profile;