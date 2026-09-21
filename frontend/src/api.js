import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const evaluateJobMatch = async (resumeText, jobUrl) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/evaluate-job`, {
      resume_text: resumeText,
      job_url: jobUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Error evaluating job match:', error.response?.data || error.message);
    throw error;
  }
};

export const discoverJobs = async (resumeText, searchTerm, skip = 0, limit = 5) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/discover-jobs`, {
      resume_text: resumeText,
      search_term: searchTerm,
      skip,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error('Error discovering jobs:', error.response?.data || error.message);
    throw error;
  }
};

export default evaluateJobMatch;
