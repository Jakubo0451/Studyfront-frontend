import backendUrl from "environment";

export const fetchStudies = async (router, setStudies, onError) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch studies");
        }

        const data = await response.json();
        setStudies(data);
    } catch (error) {
        console.error("Error fetching studies:", error);
        if (onError) onError(error.message);
    }
};

export const createStudy = async (router, onError) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Fetch existing studies to determine the next number
        const studiesResponse = await fetch(`${backendUrl}/api/studies`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!studiesResponse.ok) {
            throw new Error('Failed to fetch studies');
        }

        const existingStudies = await studiesResponse.json();

        // Find the highest number in existing "Untitled Study X" titles
        const untitledPattern = /^Untitled Study (\d+)$/;
        let highestNumber = 0;

        existingStudies.forEach(study => {
            const match = study.title.match(untitledPattern);
            if (match) {
                const number = parseInt(match[1]);
                highestNumber = Math.max(highestNumber, number);
            }
        });

        // Create new study with incremented number
        const newNumber = highestNumber + 1;
        const response = await fetch(`${backendUrl}/api/studies`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: `Untitled Study ${newNumber}`,
                description: 'No description'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create study');
        }

        const newStudy = await response.json();
        router.push(`/create?studyId=${newStudy._id}`);
    } catch (error) {
        console.error('Error creating study:', error);
        if (onError) onError(error.message);
    }
};

export const fetchStudyDetails = async (studyId, router, onStudyChange, onError) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${studyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch study details");
        }

        const studyDetails = await response.json();
        if (onStudyChange) {
            onStudyChange(studyDetails);
        }
    } catch (error) {
        console.error("Error fetching study details:", error);
        if (onError) onError(error.message);
    }
};

export const deleteStudy = async (study, router, onClose, onStudyDeleted, onError) => {
    if (!study?._id) {
        console.error("Study ID is missing for deletion.");
        return;
    }

    if (window.confirm(`Are you sure you want to delete the study "${study.title}"? This action cannot be undone.`)) {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log(`Study "${study.title}" deleted successfully.`);
                onClose();
                if (onStudyDeleted) {
                    onStudyDeleted();
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete study");
            }
        } catch (error) {
            console.error("Error deleting study:", error.message);
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
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token provided. Redirecting to login.");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
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
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token provided. Redirecting to login.");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
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

export const updateStudy = async (studyId, updatedFields, onSuccess, onError) => {
    if (!studyId) {
        console.error("Study ID is missing for updating the study.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token provided. Redirecting to login.");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${studyId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFields),
        });

        if (response.ok) {
            const updatedStudy = await response.json();
            console.log(`Study "${updatedStudy.title}" updated successfully.`);
            if (onSuccess) {
                onSuccess(updatedStudy);
            }
        } else {
            const errorData = await response.json();
            console.error("Error updating study:", errorData.error || "Failed to update study.");
            if (onError) onError(errorData.error || "Failed to update study.");
        }
    } catch (error) {
        console.error("Error updating study:", error);
        if (onError) onError(error.message);
    }
};