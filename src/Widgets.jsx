import React from "react";
import "./Widgets.css";
import InfoIcon from "@mui/icons-material/Info";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function Widgets() {
  const newsArticle = (heading, subtitle) => (
    <div className="widgets__article">
      <div className="widgets__articleLeft">
        
      </div>
      <div className="widgets__articleRight">
        <h4>{heading}</h4>
        <p>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="widgets">
      <div className="widgets__header">
        <h2>LinkedIn News</h2>
        <InfoIcon />
      </div>

      {newsArticle("Starmer's Downing Street reshuffle", "5h ago")}
      {newsArticle("East Midlands trials GPS rail tickets", "2h ago")}
      {newsArticle("Home prices drop despite projections", "6h ago")}
      {newsArticle("The rise of luxury bottled water?", "8h ago")}
      {newsArticle("UK to supply Norway with warships", "5h ago")}
    </div>
  );
}

export default Widgets;
