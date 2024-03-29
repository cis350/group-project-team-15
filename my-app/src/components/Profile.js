import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useParams } from "react-router";
import axios from "axios";

function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/${id}`);
        const data = response.data.data;
        setUserData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!userData) {
    return <div>No user found!</div>;
  }

  return (
    <div className="profile-container">
      <div className="header">
        <h1>Welcome to SkillExchange!</h1>
      </div>
      <div className="profile">
        <div className="profile-picture">
          {/* Placeholder for profile picture */}
        </div>
        <h2>{userData.email}</h2>
        <p className="skill">
          has the password:{" "}
          <span className="skill-badge">{userData.password}</span>
        </p>
        <div className="looking-for">
          <h3>Looking for:</h3>
          <div className="tags-container">
            <span className="tag">Artists</span>
            <span className="tag">Writers</span>
            <span className="tag">Singers</span>
            <span className="tag">Willy</span>
          </div>
        </div>
        <div className="search">
          <input type="text" placeholder="Find some skills to exchange!" />
        </div>
      </div>
    </div>
  );
}

export default Profile;
