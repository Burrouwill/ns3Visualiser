import React, { Component } from 'react';
import { parseXMLToJSON } from '../parser/xmlParser';

class XmlUpload extends Component {
  
  // Used to order logs of different types in terms of time
  compareTime(a, b) {
    let timeA, timeB;
    if (a && a.$ && 'fbTx' in a.$) {
      timeA = parseFloat(a.$.fbTx);
    } else if (a && a.$ && 't' in a.$) {
      timeA = parseFloat(a.$.t);
    }
    if (b && b.$ && 'fbTx' in b.$) {
      timeB = parseFloat(b.$.fbTx);
    } else if (b && b.$ && 't' in b.$) {
      timeB = parseFloat(b.$.t);
    }
    return timeA - timeB;
  }
  
  handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xmlData = e.target.result;
        try {
          const jsonData = await parseXMLToJSON(xmlData);

          if (jsonData.anim) {
            const animData = jsonData.anim;

            // Init Data
            const nodesData = {
              node: animData.node,
              nonp2plinkproperties: animData.nonp2plinkproperties,
              nodeview: animData.NodeView
            };

            // Simulation Data
            var simulationData = {
              pr: animData.pr,
              nu: animData.nu,
            };

            // Combine and organize simulation data chronologically
            simulationData = [...simulationData.nu, ...simulationData.pr];

            // Sort the combined data array by time 
            simulationData = simulationData.sort(this.compareTime);

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

