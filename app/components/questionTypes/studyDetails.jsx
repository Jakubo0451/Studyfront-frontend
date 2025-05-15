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
  timedStudy,
  endDate,
}) {
  const [name, setName] = useState(studyName);
  const [description, setDescription] = useState(studyDescription);

  const [timed, setTimed] = useState(timedStudy || false);
  const [timedDate, setTimedDate] = useState("");
  const [termsEnabled, setTermsEnabled] = useState(studyTermsEnabled || false);
  const [demographicsEnabled, setDemographicsEnabled] = useState(false);
  const [termsText, setTermsText] = useState(studyTerms || "");

  // Format date for datetime-local input when endDate prop changes
  useEffect(() => {
    if (endDate) {
      try {
        // Parse the ISO date string to a Date object
        const date = new Date(endDate);
        
        // Format to YYYY-MM-DDThh:mm (local time)
        // This is the format required by datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        console.log("Formatted date for input:", formattedDate);
        setTimedDate(formattedDate);
      } catch (error) {
        console.error("Error formatting date:", error);
        setTimedDate("");
      }
    } else {
      setTimedDate("");
    }
  }, [endDate]);

  useEffect(() => {
    setName(studyName || '');
    setDescription(studyDescription || '');
    setTimed(timedStudy || false);
    // Don't set timedDate here - it's handled in its own useEffect
    setTermsEnabled(studyTermsEnabled || false);
    setTermsText(studyTerms || '');
  }, [studyName, studyDescription, studyTermsEnabled, studyTerms, timedStudy]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    updateStudy(
      studyId,
      { title: newName },
      () => {
        if (onStudyUpdated) onStudyUpdated({ title: newName});
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
        if (onStudyUpdated) onStudyUpdated({ description: newDescription });
      },
      (error) => {
        console.error("Failed to update study description:", error);
      }
    );
  };

  const handleTimedChange = (e) => {
    const newTimed = e.target.checked;
    setTimed(newTimed);
    updateStudy(
      studyId,
      { timedStudy: newTimed },
      () => {
        if (onStudyUpdated) onStudyUpdated({ timedStudy: newTimed });
      },
      (error) => {
        console.error("Failed to update study timed:", error);
      }
    );
  }

  const handleTimedDateChange = (e) => {
    const newTimedDate = e.target.value;
    console.log("New timed date (local):", newTimedDate);
    
    setTimedDate(newTimedDate);
    
    const dateObject = new Date(newTimedDate);
    const utcDateString = dateObject.toISOString();
    
    console.log("Converted to UTC:", utcDateString);
    
    updateStudy(
      studyId,
      { endDate: utcDateString },
      () => {
        if (onStudyUpdated) onStudyUpdated({ endDate: utcDateString });
      },
      (error) => {
        console.error("Failed to update study timed date:", error);
      }
    );
  }

  const handleTermsChange = (e) => {
    const newTermsEnabled = e.target.checked;
    setTermsEnabled(newTermsEnabled);
    updateStudy(
      studyId,
      { hasTermsAndConditions: newTermsEnabled },
      () => {
        if (onStudyUpdated) onStudyUpdated({ hasTermsAndConditions: newTermsEnabled });
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
        if (onStudyUpdated) onStudyUpdated({ termsAndConditions: newTermsText });
      },
      (error) => {
        console.error("Failed to update study terms text:", error);
      }
    );
  }

  const handleDemographicsChange = (e) => {
    const newDem = e.target.checked;
    setDemographicsEnabled(newDem);
    updateStudy(
      studyId,
      { hasDemographics: newDem },
      () => {
        if (onStudyUpdated) onStudyUpdated({ hasDemographics: newDem });
      },
      (error) => {
        console.error("Failed to update study timed:", error);
      }
    );
  }

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
          name="enableTimed" 
          id="enableTimed" 
          checked={timed}
          onChange={handleTimedChange}
        />
        <label htmlFor="enableTimed">Enable Timed study</label>
      </div>
      {timed && (
        <div className={`${commonStyles.questionDescription} ${detailsStyles.termsBox}`}>
          <p className={`${commonStyles.infoBox} ${detailsStyles.termsInfo}`}>
            <IoIosInformationCircleOutline /> The study will run until the set time is reached.
          </p>
          <label htmlFor="studyEndDate">Pick the date and time the study will end:</label>
          <input
            type="datetime-local"
            name="studyEndDate"
            id="studyEndDate"
            placeholder="End date and time"
            value={timedDate}
            onChange={handleTimedDateChange}
          />
        </div>
      )}
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
      <div className={detailsStyles.termsCheckbox}>
        <input 
          type="checkbox" 
          name="enableDemographics" 
          id="enableDemographics" 
          checked={demographicsEnabled}
          onChange={handleDemographicsChange}
        />
        <label htmlFor="enableDemographics">Enable Demographics</label>
      </div>
    </div>
  );
}