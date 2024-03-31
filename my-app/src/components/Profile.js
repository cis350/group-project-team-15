import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useParams } from "react-router";
import axios from "axios";

import ConfigureSkills from "./ConfigureSkills";

function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [displayUpdate, setDisplayUpdate] = useState(false);
  const [displayLookingFor, setDisplayLookingFor] = useState(false);

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

  async function updateProfile(key, value) {
    try {
      const response = await axios.put(`http://localhost:8080/users/${id}`, { 
        id: id,
        info: [{
          "key": key,
          "value": value
        }]
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  function updateSkills(skills) {
    setUserData({ ...userData, skills: skills });
    setDisplayUpdate(false);
    // api call
    updateProfile("skills", skills);
  }

  function updateLookingFor(skills) {
    setUserData({ ...userData, "looking for": skills });
    setDisplayLookingFor(false);
    // api call
    updateProfile("looking for", skills);
  }

  return (
    <div className="profile-container">
      <div className="header">
        <h1>Welcome to SkillExchange!</h1>
      </div>
      <div className="profile">
        <div className = "left-screen">
        <div className="profile-picture">
          {/* Placeholder for profile picture */}
        </div>
        <h2>{userData.email}</h2>
        <p className="skill">
          has skills:{" "}
          <div className="individual-skill">
          {userData.skills &&
              userData.skills.map((skill) => {
                return (
                  <span key={skill} className="skill-badge mx-[1.5px]">
                    {skill}
                  </span>
                );
              })}
            </div>
          {<div className="py-2">
              <button 
                onClick={() => {setDisplayUpdate(!displayUpdate)}}
                className="bg-blue-100 p-3 text-sm font-semibold rounded-2xl
                           hover:bg-blue-200 duration-100"
              >
                Update Skills
              </button>
              {displayUpdate && 
                <ConfigureSkills 
                  skills={userData.skills ? userData.skills : []}
                  updateSkills={updateSkills}
                />}
          </div>}
        </p>
        <div className="looking-for">
          <div>
            Looking for: {" "}
            <div className = "looking-for-skill">
            {userData["looking for"] &&
              userData["looking for"].map((skill) => {
                return (
                  <span key={skill} className="skill-badge mx-[1.5px]">
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
          {<div className="py-2">
              <button 
                onClick={() => {setDisplayLookingFor(!displayLookingFor)}}
                className="bg-blue-100 p-3 text-sm font-semibold rounded-2xl
                           hover:bg-blue-200 duration-100"
              >
                Update Skills
              </button>
              {displayLookingFor && 
                <ConfigureSkills 
                  skills={userData["looking for"] ? userData["looking for"] : []}
                  updateSkills={updateLookingFor}
                />}
          </div>}
        </div>
        </div>
        <div className="search-container">
          <input type="text" placeholder="Find some skills to exchange!" className = "search"/>
          <div className = "search-results">
            {/* Search results will be displayed here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
