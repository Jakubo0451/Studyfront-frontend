import { useState, useEffect } from "react";
import commonStyles from '../../styles/questionTypes/common.module.css'
import detailsStyles from '../../styles/questionTypes/studyDetails.module.css'
import { IoIosInformationCircleOutline } from "react-icons/io";
import { updateStudy } from "@/utils/studyActions";

export default function StudyDetails({
  studyId,
  studyName,
  studyDescription,
  studyTermsEnabled,
  studyTerms,
  onStudyUpdated,
}) {
  const [name, setName] = useState(studyName);
  const [description, setDescription] = useState(studyDescription);
  const [termsEnabled, setTermsEnabled] = useState(studyTermsEnabled || false);
  const [termsText, setTermsText] = useState(studyTerms || "");

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    updateStudy(
      studyId,
      { title: newName },
      () => {
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
        if (onStudyUpdated) onStudyUpdated();
      },
      (error) => {
        console.error("Failed to update study description:", error);
      }
    );
  };

  const handleTermsChange = (e) => {
    const newTermsEnabled = e.target.checked;
    setTermsEnabled(newTermsEnabled);
    updateStudy(
      studyId,
      { hasTermsAndConditions: newTermsEnabled },
      () => {
        if (onStudyUpdated) onStudyUpdated();
      },
      (error) => {
        console.error("Failed to update study terms enabled:", error);
      }
    );
  }

  const handleTermsTextChange = (e) => {
    const newTermsText = e.target.value;
    setTermsText(newTermsText);
    updateStudy(
      studyId,
      { termsAndConditions: newTermsText },
      () => {
        if (onStudyUpdated) onStudyUpdated();
      },
      (error) => {
        console.error("Failed to update study terms text:", error);
      }
    );
  }

  useEffect(() => {
    setName(studyName || '');
    setDescription(studyDescription || '');
    setTermsEnabled(studyTermsEnabled || false);
    setTermsText(studyTerms || '');
  }, [studyName, studyDescription, studyTermsEnabled, studyTerms]);

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Study Information</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="studyName">Study Name:</label>
        <input
          type="text"
          name="studyName"
          id="studyName"
          value={name}
          onChange={handleNameChange}
          placeholder="Name"
        />
      </div>
      <div className={commonStyles.questionDescription}>
        <label htmlFor="studyDescription">Study Description:</label>
        <textarea
          name="studyDescription"
          id="studyDescription"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Description"
        ></textarea>
      </div>
      <div className={detailsStyles.termsCheckbox}>
        <input 
          type="checkbox" 
          name="enableTerms" 
          id="enableTerms" 
          checked={termsEnabled}
          onChange={handleTermsChange}
        />
        <label htmlFor="enableTerms">Enable Terms and Conditions</label>
      </div>
      
      
      {termsEnabled && (
        <div className={`${commonStyles.questionDescription} ${detailsStyles.termsBox}`}>
          <p className={`${commonStyles.infoBox} ${detailsStyles.termsInfo}`}>
            <IoIosInformationCircleOutline /> Participants will have to accept the terms and conditions before starting the study. You can add your terms and conditions in the text area below.
          </p>
          <label htmlFor="studyTerms">Study Terms and Conditions:</label>
          <textarea
            name="studyTerms"
            id="studyTerms"
            placeholder="Terms and conditions"
            rows="4"
            value={termsText}
            onChange={handleTermsTextChange}
          ></textarea>
        </div>
      )}
    </div>
  );
}