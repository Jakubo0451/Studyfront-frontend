import React, { useState } from "react";
import { updateStudy } from "@/utils/studyActions";

export default function StudyDetails({
  studyId,
  studyName,
  studyDescription,
  onStudyUpdated,
}) {
  const [name, setName] = useState(studyName);
  const [description, setDescription] = useState(studyDescription);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    updateStudy(
      studyId,
      { title: newName },
      () => {
        console.log("Study title updated successfully.");
        if (onStudyUpdated) onStudyUpdated();
      },
      (error) => {
        console.error("Failed to update study title:", error);
      }
    );
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    updateStudy(
      studyId,
      { description: newDescription },
      () => {
        console.log("Study description updated successfully.");
        if (onStudyUpdated) onStudyUpdated();
      },
      (error) => {
        console.error("Failed to update study description:", error);
      }
    );
  };

  return (
    <div className="study-details">
      <h2>Study Details</h2>
      <div className="study-name">
        <label htmlFor="studyName">Study Name:</label>
        <input
          type="text"
          name="studyName"
          id="studyName"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div className="study-description">
        <label htmlFor="studyDescription">Study Description:</label>
        <textarea
          name="studyDescription"
          id="studyDescription"
          value={description}
          onChange={handleDescriptionChange}
        ></textarea>
      </div>
    </div>
  );
}