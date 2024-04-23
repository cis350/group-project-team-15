import React, { useState, useEffect } from "react";
// import "./Profile.css";
import { useParams } from "react-router";
import axios from "axios";

import Button from '@mui/material/Button';

import ConfigureSkills from "../components/ConfigureSkills";

import { useAuth } from "../auth/AuthContext";

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


function Profile() {
  const { email } = useAuth();

  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  const [displayUpdate, setDisplayUpdate] = useState(false);
  const [displayLookingFor, setDisplayLookingFor] = useState(false);

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

  function UserInformation() {
    return (
      <div className="px-4">
        <div>
          <h1 className="py-4 mb-4 text-4xl">{userData.email}</h1>
        </div>
        <p className="text-2xl"> has skills: </p>
        <Stack direction="row" spacing={1}>
          {userData.skills &&
            userData.skills.map((skill) => {
              return (
                <Chip label={skill} />
              );
            })}
        </Stack>
        <div className="py-2">
          {isOwner && (
            <Button
              variant="outlined"
              onClick={() => {
                setDisplayUpdate(!displayUpdate);
              }}
              className="bg-blue-100 p-3 text-sm font-semibold rounded-2xl
                        hover:bg-blue-200 duration-100"
            >
              Update Skills
            </Button>
          )}
          {displayUpdate && (
            <ConfigureSkills
              skills={userData.skills ? userData.skills : []}
              updateSkills={updateSkills}
            />
          )}
          <div className="text-red-500">{errorMessage}</div>
        </div>
        <div className="looking-for">
          <div>
            Looking for:{" "}
            <div className="looking-for-skill">
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
          <div className="py-2">
            {isOwner && (
              <Button
                variant="outlined"
                onClick={() => {
                  setDisplayLookingFor(!displayLookingFor);
                }}
                className="bg-blue-100 p-3 text-sm font-semibold rounded-2xl
                           hover:bg-blue-200 duration-100"
              >
                Update Skills
              </Button>
            )}
            {displayLookingFor && (
              <ConfigureSkills
                skills={
                  userData["looking for"] ? userData["looking for"] : []
                }
                updateSkills={updateLookingFor}
              />
            )}
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="profile-container">
      <div className="flex grid-cols-2 mx-[12.5%]">
        <div className="w-[25%]">
          <UserInformation />
        </div>
      </div>
    </div>
  );
}

export default Profile;
