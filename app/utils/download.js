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
export const fetchStudyResults = async (studyId) => {
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

// New utility function to recursively flatten nested objects and arrays
// Array items are flattened with their index appended in the key (using "/" as separator)
const flattenObject = (obj, prefix = '', result = {}) => {
    for (const key in obj) {
      /* eslint-disable-next-line */
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        const newKey = prefix ? `${prefix}/${key}` : key;
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                flattenObject(item, `${newKey}/${index}`, result);
            });
        } else if (typeof value === 'object' && value !== null) {
            flattenObject(value, newKey, result);
        } else {
            result[newKey] = value;
        }
    }
    return result;
};

// Convert JSON to CSV using the new flattenObject
export const downloadAsCSV = async (studyId, fileName = "study.csv") => {
    try {
        const jsonArray = await fetchStudyResults(studyId);

        // Handle empty results case
        if (Array.isArray(jsonArray) && jsonArray.length === 0) {
            const emptyContent =
                "No results found for this study\nStudy ID: " +
                studyId +
                "\nTimestamp: " +
                new Date().toISOString();
            downloadFile(emptyContent, fileName, "text/csv");
            alert("No results found for this study. An empty file has been downloaded.");
            return;
        }

        console.log("Data structure for CSV conversion:", jsonArray);

        // Process each entry: compute duration and then flatten the whole object.
        const flattenedData = jsonArray.map(entry => {
            const base = { ...entry };
            // Compute duration in milliseconds if possible.
            if (entry.startTime && entry.endTime) {
                const diffMs = new Date(entry.endTime) - new Date(entry.startTime);
                const totalSeconds = Math.floor(diffMs / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                base.duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            return flattenObject(base);
        });

        // Collect all headers from all flattened objects.
        const allHeaders = new Set();
        flattenedData.forEach(entry => {
            Object.keys(entry).forEach(key => allHeaders.add(key));
        });
        const headers = Array.from(allHeaders);

        // Create CSV content
        const rows = flattenedData.map(entry => {
            return headers.map(header => {
                const value = entry[header] !== undefined ? entry[header] : "";
                // Escape quotes in strings
                return typeof value === 'string'
                    ? `"${value.replace(/"/g, '""')}"`
                    : `"${value}"`;
            });
        });

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

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