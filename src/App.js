import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppBar, Toolbar, Typography, Container, Paper } from '@mui/material';
import XmlUpload from './components/xmlUpload';
import Visualisation from './components/visualiser';

function App() {
  const theme = createTheme();

  const [parsedData, setParsedData] = useState(null);

  const handleParsedData = (nodesData, simulationData) => {
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

      <Container maxWidth="md" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Paper elevation={3} style={{ padding: '10px' }}>
          <XmlUpload onDataParsed={handleParsedData} />
        </Paper>
      </Container>

      <Container maxWidth="lg" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Paper elevation={3} style={{ padding: '10px' }}>
          <div className="visualizer-container" style={{ height: '500px', marginTop: '10px' }}>
            <Visualisation data={parsedData} />
          </div>
        </Paper>
      </Container>

    </ThemeProvider>
  );
}

export default App;


