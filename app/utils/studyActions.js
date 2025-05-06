import backendUrl from "environment";

export const deleteStudy = async (study, onStudyDeleted, onError) => {
    if (!study?._id) {
        console.error("Study ID is missing for deletion.");
        return;
    }

    if (window.confirm(`Are you sure you want to delete the study "${study.title}"? This action cannot be undone.`)) {
        try {
            const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log(`Study "${study.title}" deleted successfully.`);
                if (onStudyDeleted) {
                    onStudyDeleted();
                }
            } else {
                const errorData = await response.json();
                console.error("Error deleting study:", errorData.error || "Failed to delete study.");
                if (onError) onError(errorData.error || "Failed to delete study.");
            }
        } catch (error) {
            console.error("Error deleting study:", error);
            if (onError) onError(error.message);
        }
    }
};

export const startStudy = async (study, onStudyUpdated, onError) => {
    if (!study?._id) {
        console.error("Study ID is missing for starting the study.");
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ active: true }),
        });

        if (response.ok) {
            const updatedStudy = await response.json();
            console.log(`Study "${updatedStudy.title}" started successfully.`);
            if (onStudyUpdated) {
                onStudyUpdated(updatedStudy);
            }
        } else {
            const errorData = await response.json();
            console.error("Error starting study:", errorData.error || "Failed to start study.");
            if (onError) onError(errorData.error || "Failed to start study.");
        }
    } catch (error) {
        console.error("Error starting study:", error);
        if (onError) onError(error.message);
    }
};

export const endStudy = async (study, onStudyUpdated, onError) => {
    if (!study?._id) {
        console.error("Study ID is missing for ending the study.");
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ active: false, completed: true }),
        });

        if (response.ok) {
            const updatedStudy = await response.json();
            console.log(`Study "${updatedStudy.title}" ended successfully.`);
            if (onStudyUpdated) {
                onStudyUpdated(updatedStudy);
            }
        } else {
            const errorData = await response.json();
            console.error("Error ending study:", errorData.error || "Failed to end study.");
            if (onError) onError(errorData.error || "Failed to end study.");
        }
    } catch (error) {
        console.error("Error ending study:", error);
        if (onError) onError(error.message);
    }
};

export const editStudy = (study, router) => {
    if (!study?._id) {
        console.error("Study ID is missing for editing.");
        return;
    }
    router.push(`/create?studyId=${study._id}`);
};