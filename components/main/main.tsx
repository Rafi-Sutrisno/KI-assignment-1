"use client";
import "./Main.css";
import { decrypt } from "../encryptions/aes";

const Main = () => {
  return (
    <div className="main-container">
      <div className="greet">
        <p>
          <span>Welcome to SmoothBrains!</span>
        </p>
        <p className="desc">Tugas Keamanan Informasi 1</p>
      </div>
    </div>
  );
};

export default Main;
