import React, { useState } from 'react';
import XmlUpload from './components/xmlUpload';
import Visualisation from './components/visualiser'; 

function App() {
  const [parsedData, setParsedData] = useState(null);

  const handleParsedData = (nodesData, simulationData) => {
    // You can add any further processing if needed
    // For now, just set the data in the state
    setParsedData({ nodesData, simulationData });
  };

  return (
    <div className="App">
      <h1>Network Simulation</h1>
      <XmlUpload onDataParsed={handleParsedData} />
      <Visualisation data={parsedData} /> {/* Pass the parsed data to Visualization */}
      <h2>NotAHEader</h2>
    </div>
  );
}

export default App;

