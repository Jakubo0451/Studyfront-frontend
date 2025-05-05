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
    console.log("Fetching study results for ID:", studyId);
    try {
        const response = await fetch(`${backendUrl}/api/results/${studyId}`); // Updated endpoint
        if (!response.ok) {
            throw new Error(`Failed to fetch results for study ID: ${studyId}`);
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
        const jsonObject = await fetchStudyResults(studyId);
        const keys = Object.keys(jsonObject);
        const csvContent = [
            keys.join(","),
            keys.map((key) => `"${jsonObject[key] || ""}"`).join(",")
        ].join("\n");

        downloadFile(csvContent, fileName, "text/csv");
    } catch (error) {
        console.error("Error downloading CSV:", error);
    }
};

// Convert JSON to XML
export const downloadAsXML = async (studyId, fileName = "study.xml") => {
    try {
        const jsonObject = await fetchStudyResults(studyId);
        const convertToXML = (obj, rootName = "root") => {
            let xml = `<${rootName}>`;
            for (const key in obj) {
                if (Array.isArray(obj[key])) {
                    xml += obj[key]
                        .map((item) => convertToXML(item, key))
                        .join("");
                } else if (typeof obj[key] === "object" && obj[key] !== null) {
                    xml += convertToXML(obj[key], key);
                } else {
                    xml += `<${key}>${obj[key] || ""}</${key}>`;
                }
            }
            xml += `</${rootName}>`;
            return xml;
        };

        const xmlContent = convertToXML(jsonObject, "study");
        downloadFile(xmlContent, fileName, "application/xml");
    } catch (error) {
        console.error("Error downloading XML:", error);
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