import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { spacesApi } from '../api/spaces';

const APITester = () => {
  const [testResults, setTestResults] = React.useState([]);
  
  const addResult = (message, isError = false) => {
    setTestResults(prev => [...prev, { message, isError, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTest = async (testName, testFunction) => {
    addResult(`🔄 Running ${testName}...`);
    try {
      const result = await testFunction();
      addResult(`✅ ${testName} successful: ${JSON.stringify(result)}`, false);
    } catch (error) {
      addResult(`❌ ${testName} failed: ${error.response?.status} - ${JSON.stringify(error.response?.data) || error.message}`, true);
    }
  };

  const tests = [
    {
      name: 'Endpoint Check',
      fn: () => spacesApi.testEndpoint()
    },
    {
      name: 'Fetch Spaces',
      fn: () => spacesApi.fetchSpaces()
    },
    {
      name: 'Minimal Create Test',
      fn: () => spacesApi.testCreate()
    },
    {
      name: 'Full Create Test',
      fn: () => spacesApi.create({
        spaceName: 'Full Test Room',
        seater: 6,
        price: 1200,
        availability: 'AVAILABLE',
        images: [],
        availableDates: []
      })
    }
  ];

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        🔧 API Tester - Debug 500 Error
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        {tests.map((test, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => runTest(test.name, test.fn)}
            sx={{ mr: 1, mb: 1 }}
          >
            Test {test.name}
          </Button>
        ))}
        <Button
          variant="contained"
          onClick={() => setTestResults([])}
          color="secondary"
        >
          Clear Results
        </Button>
      </Box>

      <Box sx={{ maxHeight: 400, overflow: 'auto', bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Test Results:
        </Typography>
        {testResults.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            Click a test button to see results...
          </Typography>
        ) : (
          testResults.map((result, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                color: result.isError ? 'error.main' : 'success.main',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                mb: 0.5
              }}
            >
              [{result.timestamp}] {result.message}
            </Typography>
          ))
        )}
      </Box>
      
      <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
        💡 Check browser console for detailed logs. This tester helps identify the exact issue.
      </Typography>
    </Box>
  );
};

export default APITester;