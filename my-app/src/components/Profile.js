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

  function callUpdate() {
    try {
      const response = axios.put(`http://localhost:8080/users/${id}`, {
        email: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
    }
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
          has skills:{" "}
          {userData.skills &&
            userData.skills.map((skill) => {
              return (
                <span key={skill} className="skill-badge">
                  {skill}
                </span>
              );
            })}
        </p>
        <div className="looking-for">
          <h3>Looking for:</h3>
          <div className="tags-container">
            {userData["looking for"] &&
              userData["looking for"].map((skill) => {
                return (
                  <span key={skill} className="skill-badge">
                    {skill}
                  </span>
                );
              })}
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
