import React, { useState, useEffect } from "react";
// import "./Profile.css";
import { useParams } from "react-router";

import { useAuth } from "../auth/AuthContext";

import Divider from "@mui/material/Divider";

import DisplayArray from "../components/DisplayArray";
// import EditSkills from "../components/EditSkills";

import { getProfile, updateProfile } from "../api/profile";

import SkillCard from "../components/SkillCard";
import SkillModal from "../components/SkillModal";
import { Button, Grid, Typography } from "@mui/material";

/**
 * A React component for displaying and managing a user's profile. It features functionality for viewing user information,
 * skills, and provides interactive options such as adding new skills or deleting existing ones if the user is viewing their own profile.
 * The component fetches user profile data using an API call and dynamically updates the user's skills through additional API interactions.
 * 
 * It employs several sub-components:
 * - DisplayArray: to show a list of skills that can be interactively managed.
 * - SkillModal: for adding new skills.
 * - SkillCard: to represent individual skills.
 * 
 * Conditionally renders different UI elements based on the user's ownership of the profile and whether they are logged in.
 *
 * @returns {JSX.Element} The rendered user profile page with management options if the viewer owns the profile.
 */
function Profile() {
  const { email } = useAuth();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const { success, data } = await getProfile(id);
        if (success) {
          console.log(data);
          setUserData(data);
          setIsOwner(email === data.email);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData(id);
  }, [email, id]);

  if (!userData) {
    return <div>No user found!</div>;
  }

  async function callUpdateAPI(key, value) {
    const { success, errorMessage } = await updateProfile(id, key, value);
    setErrorMessage(errorMessage);
    if (success) {
      console.log("Profile updated");
    }
  }

  function addSkill(skill) {
    const updated = [...userData.skills, skill];
    console.log("updating");
    updateSkills(updated);
  }
  // api call

  function deleteSkill(id) {
    const updated = userData.skills.filter((_, index) => index !== id);
    updateSkills(updated);
  }

  function updateSkills(skills) {
    setUserData({ ...userData, skills: skills });
    // api call
    callUpdateAPI("skills", skills);
  }

  // function updateLookingFor(skills) {
  //   setUserData({ ...userData, "looking for": skills });
  //   // api call
  //   callUpdateAPI("looking for", skills);
  // }

  function UserInformation() {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editSkills, setEditSkills] = useState(false);

    return (
      <div className="px-4">
        <h1 className="py-4 mt-4 text-4xl">{userData.email}</h1>
        <Divider />
        <Grid container spacing={2}>
          <span className="text-2xl"></span>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ marginBottom: -1 }}>
              {" "}
              Has skills:{" "}
            </Typography>
          </Grid>
          {isOwner &&
          <Grid item xs={12} mt>
            <Button
              onClick={() => {
                setAddModalOpen(true);
              }}
              variant="contained"
              disableElevation
              sx={{ marginRight: 2 }}
              data-testid="add-skill"
            >
              Add
            </Button>
            <Button
              onClick={() => {
                setEditSkills((old) => !old);
              }}
              variant="outlined"
            >
              {editSkills ? "Done" : "Delete"}
            </Button>
          </Grid>
  }
          <Grid item xs={12}>
            <DisplayArray
              edit={editSkills}
              deleteSkill={deleteSkill}
              skillArray={userData.skills}
              testID="has-skills"
            />
          </Grid>

          <SkillModal
            open={addModalOpen}
            setOpen={setAddModalOpen}
            update={addSkill}
          />
          <div className="text-red-500">{errorMessage}</div>
        </Grid>
          {/* <Divider />
          <div className="looking-for py-4">
            <span className="text-2xl"> Looking for: </span>
            <DisplayArray
              skillArray={userData["looking for"]}
              testID="looking-for"
            />
            <EditSkills
              IsVisible={isOwner}
              skills={userData["looking for"]}
              updateSkills={updateLookingFor}
              testID="update-looking"
            />
          </div> */}
      </div>
    );
  }

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
