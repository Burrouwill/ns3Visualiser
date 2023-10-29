import React, { Component } from 'react';
import { parseXMLToJSON } from '../parser/xmlParser'; // Adjust the import path


class XmlUpload extends Component {
  handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xmlData = e.target.result;
        try {
          const jsonData = await parseXMLToJSON(xmlData);
          
          // Check if the 'anim' object exists
          if (jsonData.anim) {
            const animData = jsonData.anim;
            console.log(animData)
            // Filter data for setting up nodes
            const nodesData = {
              node: animData.node, // More data about nodes
              nonp2plinkproperties: animData.nonp2plinkproperties, // Node properties
            };
  
            // Filter data for the simulation
            const simulationData = {
              wpr: animData.wpr, // Data about packets 
              nu: animData.nu, // Data about node updates & movement
            };
  
            // Set the filtered data in the component's state
            this.setState({
              nodesData,
              simulationData,
            });

            this.props.onDataParsed(nodesData, simulationData);
            
          } else {
            console.error('No "anim" object found in the JSON data.');
          }
        } catch (error) {
          console.error('XML parsing error:', error);
        }
      };
      reader.readAsText(file);
    }
  }
  

  render() {
    return (
      <div>
        <input
          type="file"
          accept=".xml"
          onChange={this.handleFileUpload}
        />
      </div>
    );
  }
}

export default XmlUpload;
