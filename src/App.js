import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppBar, Toolbar, Typography, Container, Paper } from '@mui/material';
import XmlUpload from './components/xmlUpload';
import Visualisation from './components/visualiser';

function App() {
  const theme = createTheme();

  const [parsedData, setParsedData] = useState(null);

  const handleParsedData = (nodesData, simulationData) => {
    // You can add any further processing if needed
    // For now, just set the data in the state
    setParsedData({ nodesData, simulationData });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Network Simulation</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <XmlUpload onDataParsed={handleParsedData} />
        </Paper>
        <div className="visualizer-container" style={{ marginTop: '20px' }}>
          <Visualisation data={parsedData} /> 
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;


