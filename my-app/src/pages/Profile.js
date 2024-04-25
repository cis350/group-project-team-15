import React, { useState, useEffect } from "react";
// import "./Profile.css";
import { useParams } from "react-router";
import axios from "axios";

import { useAuth } from "../auth/AuthContext";

import Divider from '@mui/material/Divider';

import DisplayArray from "../components/DisplayArray";
import EditSkills from "../components/EditSkills";



function Profile() {
  const { email } = useAuth();

  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8080/users/${id}`);
        const data = response.data.data;
        setUserData(data);
        setIsOwner(email === data.email);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData(id);
  }, [email, id]);

  if (!userData) {
    return <div>No user found!</div>;
  }

  async function updateProfile(key, value) {
    try {
      const response = await axios.put(`http://localhost:8080/users/${id}`, {
        id: id,
        info: [
          {
            key: key,
            value: value,
          },
        ],
      });
      console.log(response);
      setErrorMessage("");
    } catch (err) {
      console.error(err);
      setErrorMessage("There was an error updating the profile");
    }
  }

  function updateSkills(skills) {
    setUserData({ ...userData, skills: skills });
    // api call
    updateProfile("skills", skills);
  }

  function updateLookingFor(skills) {
    setUserData({ ...userData, "looking for": skills });
    // api call
    updateProfile("looking for", skills);
  }

  function UserInformation() {
    return (
      <div className="px-4">
        <h1 className="py-4 mt-4 text-4xl">{userData.email}</h1>
        <Divider/>
        <div className="has-skills py-4">
          <span className="text-2xl"> Has skills: </span>
          <DisplayArray skillArray={userData.skills} />
          <EditSkills
              IsVisible={isOwner}
              skills={userData.skills}
              updateSkills={updateSkills}
          />
          <div className="text-red-500">{errorMessage}</div>
        </div>
        <Divider/>
        <div className="looking-for py-4">
          <span className="text-2xl"> Looking for: </span>
          <DisplayArray skillArray={userData["looking for"]} />
          <EditSkills
            IsVisible={isOwner}
            skills={userData["looking for"]}
            updateSkills={updateLookingFor}
          />
        </div>
      </div>
    )
  };

  return (
    <div className="profile-container">
      <div className="flex justify-center">
        <div className="w-[60%]">
          <UserInformation />
        </div>
      </div>
    </div>
  );
}

export default Profile;
