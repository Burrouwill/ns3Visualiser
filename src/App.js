import React, { useState } from 'react';
import XmlUpload from './components/xmlUpload';
import Visualization from './components/visualiser';

function App() {
  const [parsedData, setParsedData] = useState(null);

  const handleParsedData = (data) => {
    setParsedData(data);
  };

  return (
    <div className="App">
      <h1>Network Simulation</h1>
      <XmlUpload onParsedData={handleParsedData} />
      <Visualization data={parsedData} />
    </div>
  );
}

export default App;
