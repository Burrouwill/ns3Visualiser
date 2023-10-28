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
          // Handle the parsed JSON data, e.g., update the state or perform further processing
          console.log(jsonData);
        } catch (error) {
          // Handle parsing errors
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
