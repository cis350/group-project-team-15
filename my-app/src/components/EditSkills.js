import React, { useState } from "react";
import ConfigureSkills from "./ConfigureSkills";
import Button from "@mui/material/Button";

function EditSkills(props) {
    const visible = props.IsVisible;
    const [displayUpdate, setDisplayUpdate] = useState(false);

    return (
        <div>
            {visible && (
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
                    skills={props.skills}
                    updateSkills={props.updateSkills}
                />
            )}
        </div>
    );
}

export default EditSkills;