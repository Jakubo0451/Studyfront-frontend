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

// Modify checkAlternativeEndpoints to save successful endpoint
const checkAlternativeEndpoints = async (studyId) => {
  const token = localStorage.getItem('token');
  console.log("Checking alternative endpoints for study results");
  
  // Try these alternative paths that might contain the results
  const alternativeEndpoints = [
    `/api/responses/study/${studyId}`,
    `/api/studies/${studyId}/responses`,
    `/api/responses?studyId=${studyId}`,
    `/api/studies/${studyId}/results`
  ];
  
  for (const endpoint of alternativeEndpoints) {
    try {
      console.log(`Trying endpoint: ${backendUrl}${endpoint}`);
      const response = await fetch(`${backendUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        console.log(`Found successful endpoint: ${endpoint}`);
        const data = await response.json();
        if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
          // Save this successful endpoint pattern for future use
          const endpointPattern = endpoint.replace(studyId, ':studyId');
          localStorage.setItem('successfulResultsEndpoint', endpointPattern);
          console.log(`Saved successful endpoint pattern: ${endpointPattern}`);
          return data;
        }
      }
    } catch (error) {
      console.log(`Endpoint ${endpoint} error:`, error.message);
    }
  }
  return null;
};

// Fetch study results from the backend with optimized endpoint selection
const fetchStudyResults = async (studyId) => {
  const token = localStorage.getItem('token');
  
  // First check if we have a previously successful endpoint stored
  const successfulEndpoint = localStorage.getItem('successfulResultsEndpoint');
  
  // If we have a stored successful endpoint, try it first
  if (successfulEndpoint) {
    console.log(`Trying previously successful endpoint: ${successfulEndpoint} for study ${studyId}`);
    try {
      const response = await fetch(`${backendUrl}${successfulEndpoint.replace(':studyId', studyId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        console.log(`Previously successful endpoint worked again!`);
        const data = await response.json();
        if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
          return data;
        }
      } else {
        console.log(`Previously successful endpoint no longer works, will try alternatives`);
        localStorage.removeItem('successfulResultsEndpoint'); // Clear the stored endpoint
      }
    } catch (error) {
      console.error(`Error with stored endpoint: ${error.message}`);
      localStorage.removeItem('successfulResultsEndpoint'); // Clear the stored endpoint
    }
  }

  // Try alternative endpoints directly without waiting for multiple failures
  console.log("Trying all potential endpoints to find study results...");
  const alternativeResults = await checkAlternativeEndpoints(studyId);
  if (alternativeResults) {
    return alternativeResults;
  }
  
  // If nothing worked, try the original endpoint with fewer retries
  let attempts = 0;
  const maxAttempts = 2; // Reduced from 5 to 2
  
  console.log(`Starting to fetch results for study ID: ${studyId}`);
  console.log(`Using backend URL: ${backendUrl}/api/studies/results/${studyId}`);
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Attempt ${attempts + 1} to fetch results for study ID: ${studyId}`);
      
      const response = await fetch(`${backendUrl}/api/studies/results/${studyId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      // Log raw response information
      console.log(`Response status: ${response.status}`);
      
      const responseText = await response.text();
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`Failed to parse response as JSON: ${parseError.message}`);
        data = { error: "Invalid JSON response" };
      }
      
      if (!response.ok) {
        if (attempts < maxAttempts - 1) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return []; // Return empty array on final attempt
      }
      
      return data;
    } catch (error) {
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000), error);
      }
    }
  }
  
  return []; // Return empty array if we exit the loop without returning data
};

// Export for testing purposes
export { checkAlternativeEndpoints };

// Download as JSON
export const downloadAsJSON = async (studyId, fileName = "study.json") => {
    try {
        const jsonObject = await fetchStudyResults(studyId);
        
        // Handle empty results case
        if (Array.isArray(jsonObject) && jsonObject.length === 0) {
            const emptyContent = JSON.stringify({
                message: "No results found for this study",
                studyId: studyId,
                timestamp: new Date().toISOString()
            }, null, 2);
            downloadFile(emptyContent, fileName, "application/json");
            alert("No results found for this study. An empty file has been downloaded.");
            return;
        }
        
        const jsonContent = JSON.stringify(jsonObject, null, 2);
        downloadFile(jsonContent, fileName, "application/json");
    } catch (error) {
        console.error("Error downloading JSON:", error);
        alert(`Error downloading results: ${error.message}`);
    }
};

// Convert JSON to CSV
export const downloadAsCSV = async (studyId, fileName = "study.csv") => {
    try {
        const jsonArray = await fetchStudyResults(studyId);
        
        // Handle empty results case
        if (Array.isArray(jsonArray) && jsonArray.length === 0) {
            const emptyContent = "No results found for this study\nStudy ID: " + studyId + "\nTimestamp: " + new Date().toISOString();
            downloadFile(emptyContent, fileName, "text/csv");
            alert("No results found for this study. An empty file has been downloaded.");
            return;
        }

        console.log("Data structure for CSV conversion:", jsonArray);
        
        // Check data structure and adapt accordingly
        let csvContent;
        
        // First, determine if we have the expected structure with answers property
        const hasAnswersArray = jsonArray.some(entry => entry.answers && Array.isArray(entry.answers));
        
        if (hasAnswersArray) {
            // Original logic for answers array structure
            // Extract all unique question IDs from the answers
            const questionIds = new Set();
            jsonArray.forEach((entry) => {
                if (entry.answers && Array.isArray(entry.answers)) {
                    entry.answers.forEach((answer) => {
                        if (answer && answer.questionId) {
                            questionIds.add(answer.questionId);
                        }
                    });
                }
            });

            // Convert the Set to an array for consistent ordering
            const questionIdArray = Array.from(questionIds);

            // Build the CSV header
            const headers = [
                "_id",
                "studyId",
                ...questionIdArray.map((id) => `question_${id}`),
                "submittedAt",
                "createdAt",
                "updatedAt",
            ];

            // Build the CSV rows
            const rows = jsonArray.map((entry) => {
                // Flatten the answers into a single row
                const answersMap = {};
                
                if (entry.answers && Array.isArray(entry.answers)) {
                    entry.answers.forEach((answer) => {
                        if (answer && answer.questionId) {
                            answersMap[`question_${answer.questionId}`] = answer.answer;
                        }
                    });
                }

                // Return a row with all fields
                return [
                    entry._id || "",
                    entry.studyId || "",
                    ...questionIdArray.map((id) => answersMap[`question_${id}`] || ""),
                    entry.submittedAt || "",
                    entry.createdAt || "",
                    entry.updatedAt || "",
                ];
            });

            // Combine the header and rows into CSV content
            csvContent = [
                headers.join(","), 
                ...rows.map((row) => row.map((value) => `"${value}"`).join(","))
            ].join("\n");
            
        } else {
            // Alternative logic for different data structure
            // Extract all keys from the first object to use as headers
            const firstEntry = jsonArray[0] || {};
            let headers = Object.keys(firstEntry);
            
            // If the data is too complex, flatten it
            if (headers.some(key => typeof firstEntry[key] === 'object' && firstEntry[key] !== null)) {
                console.log("Complex data structure detected, flattening for CSV");
                
                // Create a simple flattened CSV with stringified objects for complex fields
                headers = ["_id", "rawData"];
                const rows = jsonArray.map(entry => {
                    return [
                        entry._id || "",
                        JSON.stringify(entry)
                    ];
                });
                
                csvContent = [
                    headers.join(","),
                    ...rows.map(row => row.map(value => `"${value}"`).join(","))
                ].join("\n");
            } else {
                // Simple object structure with primitive values
                const rows = jsonArray.map(entry => {
                    return headers.map(key => entry[key] || "");
                });
                
                csvContent = [
                    headers.join(","),
                    ...rows.map(row => row.map(value => `"${value}"`).join(","))
                ].join("\n");
            }
        }

        // Trigger the file download
        downloadFile(csvContent, fileName, "text/csv");
    } catch (error) {
        console.error("Error downloading CSV:", error);
        alert(`Error downloading CSV: ${error.message}`);
    }
};

// Convert JSON to Plain Text
export const downloadAsPlainText = async (studyId, fileName = "study.txt") => {
    try {
        const jsonObject = await fetchStudyResults(studyId);
        
        // Add this check to match the other download functions
        if (Array.isArray(jsonObject) && jsonObject.length === 0) {
            const emptyContent = "No results found for this study\nStudy ID: " + studyId + "\nTimestamp: " + new Date().toISOString();
            downloadFile(emptyContent, fileName, "text/plain");
            alert("No results found for this study. An empty file has been downloaded.");
            return;
        }
        
        const plainTextContent = JSON.stringify(jsonObject, null, 2);
        downloadFile(plainTextContent, fileName, "text/plain");
    } catch (error) {
        console.error("Error downloading Plain Text:", error);
        alert(`Error downloading results: ${error.message}`);  // Add this alert to match other functions
    }
};