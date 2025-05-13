import backendUrl from 'environment';

// Function to trigger a file download
const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
};

// Fetch study results from the backend
const fetchStudyResults = async (studyId) => {
  const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${backendUrl}/api/studies/results/${studyId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch results for study ID: ${studyId}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching study results:", error);
        throw error;
    }
};

// Download as JSON
export const downloadAsJSON = async (studyId, fileName = "study.json") => {
    try {
        const jsonObject = await fetchStudyResults(studyId);
        const jsonContent = JSON.stringify(jsonObject, null, 2);
        downloadFile(jsonContent, fileName, "application/json");
    } catch (error) {
        console.error("Error downloading JSON:", error);
    }
};

// Convert JSON to CSV
export const downloadAsCSV = async (studyId, fileName = "study.csv") => {
    try {
        const jsonArray = await fetchStudyResults(studyId);

        // Extract all unique question IDs from the answers
        const questionIds = new Set();
        jsonArray.forEach((entry) => {
            entry.answers.forEach((answer) => {
                questionIds.add(answer.questionId);
            });
        });

        // Convert the Set to an array for consistent ordering
        const questionIdArray = Array.from(questionIds);

        // Build the CSV header
        const headers = [
            "_id",
            "studyId",
            ...questionIdArray.map((id) => `question_${id}`), // Add columns for each question
            "submittedAt",
            "createdAt",
            "updatedAt",
        ];

        // Build the CSV rows
        const rows = jsonArray.map((entry) => {
            // Flatten the answers into a single row
            const answersMap = {};
            entry.answers.forEach((answer) => {
                answersMap[`question_${answer.questionId}`] = answer.answer;
            });

            // Return a row with all fields
            return [
                entry._id,
                entry.studyId,
                ...questionIdArray.map((id) => answersMap[`question_${id}`] || ""), // Fill in answers or leave blank
                entry.submittedAt,
                entry.createdAt,
                entry.updatedAt,
            ];
        });

        // Combine the header and rows into CSV content
        const csvContent = [
            headers.join(","), // Header row
            ...rows.map((row) => row.map((value) => `"${value}"`).join(",")), // Data rows
        ].join("\n");

        // Trigger the file download
        downloadFile(csvContent, fileName, "text/csv");
    } catch (error) {
        console.error("Error downloading CSV:", error);
    }
};

// Convert JSON to Plain Text
export const downloadAsPlainText = async (studyId, fileName = "study.txt") => {
    try {
        const jsonObject = await fetchStudyResults(studyId);
        const plainTextContent = JSON.stringify(jsonObject, null, 2);
        downloadFile(plainTextContent, fileName, "text/plain");
    } catch (error) {
        console.error("Error downloading Plain Text:", error);
    }
};