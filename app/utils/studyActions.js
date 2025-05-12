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
}

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

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

            if (response.ok) {
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
};

export const startStudy = async (study, onStudyUpdated, onError) => {
    if (!study?._id) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ active: true, completed: false }),
        });

        if (response.ok) {
            const updatedStudy = await response.json();
            if (onStudyUpdated) {
                onStudyUpdated(updatedStudy);
            }

        } else {
            const errorText = await response.text();
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || 'Failed to start study';
            } catch (e) {
                errorMessage = errorText || 'Failed to start study', e;
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Error starting study:", error);
        if (onError) onError(error.message);
    }
};

export const endStudy = async (study, onStudyUpdated, onError) => {
    if (!study?._id) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) return;

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
            if (onStudyUpdated) {
                onStudyUpdated(updatedStudy);
            }
        } else {
            const errorText = await response.text();
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || 'Failed to end study';
            } catch (e) {
                errorMessage = errorText || 'Failed to end study', e;
            }
            throw new Error(errorMessage);
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

export const updateQuestions = async (studyId, updatedQuestions, onSuccess, onError) => {
    if (!studyId) {
        console.error("Study ID is missing for updating questions.");
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
            body: JSON.stringify({ questions: updatedQuestions }),
        });

        if (response.ok) {
            const updatedStudy = await response.json();
            if (onSuccess) {
                onSuccess(updatedStudy.questions);
            }
        } else {
            const errorData = await response.json();
            console.error("Error updating questions:", errorData.error || "Failed to update questions.");
            if (onError) onError(errorData.error || "Failed to update questions.");
        }
    } catch (error) {
        console.error("Error updating questions:", error);
        if (onError) onError(error.message);
    }
};

export const addQuestion = async (studyId, newQuestion, onSuccess, onError) => {
    if (!studyId) {
        console.error("Study ID is missing for adding a question.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token provided. Redirecting to login.");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${studyId}/questions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newQuestion),
        });

        if (response.ok) {
            const updatedStudy = await response.json();
            if (onSuccess) {
                onSuccess(updatedStudy);
            }
        } else {
            const errorData = await response.json();
            console.error("Error adding question:", errorData.error || "Failed to add question.");
            if (onError) onError(errorData.error || "Failed to add question.");
        }
    } catch (error) {
        console.error("Error adding question:", error);
        if (onError) onError(error.message);
    }
};

export const updateQuestion = async (studyId, questionId, payload, onSuccess, onError) => {
    if (!studyId || !questionId) {
        console.error("Study ID or Question ID is missing for updating the question.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token provided. Redirecting to login.");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${studyId}/questions/${questionId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload), // Send the wrapped payload
        });

        if (response.ok) {
            const updatedStudy = await response.json();
            if (onSuccess) {
                onSuccess(updatedStudy);
            }
        } else {
            const errorData = await response.json();
            console.error("Error updating question:", errorData.error || "Failed to update question.");
            if (onError) onError(errorData.error || "Failed to update question.");
        }
    } catch (error) {
        console.error("Error updating question:", error);
        if (onError) onError(error.message);
    }
};

export const deleteQuestion = async (studyId, questionId, onSuccess, onError) => {
    if (!studyId || !questionId) {
        console.error("Study ID or Question ID is missing for deleting the question.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token provided. Redirecting to login.");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${studyId}/questions/${questionId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const updatedStudy = await response.json();
            if (onSuccess) {
                onSuccess(updatedStudy);
            }
        } else {
            const errorData = await response.json();
            console.error("Error deleting question:", errorData.error || "Failed to delete question.");
            if (onError) onError(errorData.error || "Failed to delete question.");
        }
    } catch (error) {
        console.error("Error deleting question:", error);
        if (onError) onError(error.message);
    }
};