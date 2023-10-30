import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppBar, Toolbar, Typography, Container, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

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

      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ns3 Visualiser
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Box border={1} borderColor="grey.400" borderRadius={4} p={2}>
          <XmlUpload onDataParsed={handleParsedData} />
        </Box>
      </Container>

      <Container maxWidth="sm" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Box border={1} borderColor="grey.400" borderRadius={4} p={2} display="flex" justifyContent="center" alignItems="center">
          <div className="visualizer-container" style={{ height: '500px' }}>
            <Visualisation data={parsedData} maxWidth={500} maxHeight={500} />
          </div>
        </Box>
      </Container>


    </ThemeProvider>
  );
}

export default App;


