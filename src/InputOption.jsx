import React from "react";
import "./InputOption.css";

function InputOption({ Icon, title, color, onClick }) {
  return (
    <div className="inputOption" onClick={onClick}>
      <Icon style={{ color: color }} />
      <h4 style={{ color: color }}>{title}</h4>
    </div>
  );
}

export default InputOption;
