import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function ConfigureSkills(props) {
    const [skillArray, setSkillArray] = useState(props.skills);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function addSkill(skill, id) {
        setSkillArray([...skillArray, skill]);
    }

    function removeSkill(id) {
        setSkillArray(skillArray.filter((skill, index) => index !== id));
    }

    function changeSkillName(id, value) {
        setSkillArray(skillArray.map((skill, index) => index === id ? value : skill));
    }

    function updateSkills() {
        setHasError(false);
        const emptyCount = skillArray.filter((skill) => skill === "").length;
        if (emptyCount > 0) {
            setErrorMessage("Please fill in all the fields");
            setHasError(true);
            return;
        }
        setErrorMessage("");
        props.updateSkills(skillArray);
    }

    function skillTag(skill, id) {
        return (
            <div key={id} className="bg-blue-200 p-2 rounded-2xl h-10 m-1">
                <input
                    value={skill}
                    onChange={(e) => changeSkillName(id, e.target.value)}
                    className="w-20 bg-blue-200 ml-2"
                >
                </input>
                <IconButton
                    onClick={() => removeSkill(id)}
                    className="w-2 h-2 hover:text-white duration-100"
                    aria-label="delete"
                >
                    <CloseIcon
                        fontSize="small"
                    />
                </IconButton>
            </div>
        );
    }

    return (
        <div className="p-2 w-64 ">
            <div className="flex flex-wrap w-full space-x-2 p-2 outline-2 outline-gray-500 
                            outline py-2 my-2 rounded-lg overflow-y-scroll">
                {skillArray.map((skill, id) => skillTag(skill, id))}
                <button
                    className="w-10 h-10 m-1 bg-slate-100 rounded-3xl hover:bg-slate-300 duration-100"
                    onClick={() => addSkill("", skillArray.length)}
                >+</button>
            </div>
            {hasError && <div className="text-red-500">{errorMessage}</div>}
            <button
                className="rounded-2xl ml-3 bg-slate-200 p-3 text-sm hover:bg-slate-300 duration-100"
                onClick={() => updateSkills()}
            >
                Save changes
            </button>
        </div>
    );
}

export default ConfigureSkills;