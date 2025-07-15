const axios = require('axios');
const { Buffer } = require('buffer');

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true';

const JUDGE0_HEADERS = {
  'content-type': 'application/json',
  'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // Make sure it's loaded
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
};

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

async function runCode({ sourceCode, language, stdin = '' }) {
  const languageId = languageMap[language.toLowerCase()];
  if (!languageId) throw new Error('Unsupported language');

  // ✅ Base64 encode source code and stdin
  const payload = {
    source_code: Buffer.from(sourceCode).toString('base64'),
    language_id: languageId,
    stdin: Buffer.from(stdin).toString('base64'),
  };

  try {
    const response = await axios.post(JUDGE0_API_URL, payload, { headers: JUDGE0_HEADERS });

    return {
      output: Buffer.from(response.data.stdout || '', 'base64').toString('utf8'),
      stderr: Buffer.from(response.data.stderr || '', 'base64').toString('utf8'),
      status: response.data.status,
    };
  } catch (error) {
    console.error('Judge0 API error:', error?.response?.data || error.message);
    throw new Error('Failed to compile/execute code');
  }
}

module.exports = runCode;
