import React from 'react';

function Visualization({ data }) {
  if (!data) {
    return <div>Select an XML file to parse and visualize.</div>;
  }

  // Render your visualization based on the parsed data
  return (
    <div>
      <h2>Visualization</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Visualization;
