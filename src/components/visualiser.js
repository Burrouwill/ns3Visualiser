import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Visualization({ data, maxWidth, maxHeight, startSimulationFlag }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    /***********************
    *   Init Simulation    *
    ***********************/

    // Clear the previous visualization
    svg.selectAll('*').remove();

    // Calculate the center point of the grid
    const centerX = maxWidth / 2;
    const centerY = maxHeight / 2;

    // Grid settings
    const gridSize = 20; // Number of rows and columns
    const gridUnitSize = Math.min(maxWidth, maxHeight) / gridSize;

    // Create horizontal grid lines
    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', centerY + i * gridUnitSize)
        .attr('x2', maxWidth)
        .attr('y2', centerY + i * gridUnitSize)
        .style('stroke', 'lightgray')
        .style('stroke-width', 1);
    }

    // Create vertical grid lines
    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      svg.append('line')
        .attr('x1', centerX + i * gridUnitSize)
        .attr('y1', 0)
        .attr('x2', centerX + i * gridUnitSize)
        .attr('y2', maxHeight)
        .style('stroke', 'lightgray')
        .style('stroke-width', 1);
    }

    // Create x-axis
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', centerY)
      .attr('x2', maxWidth)
      .attr('y2', centerY)
      .style('stroke', 'black')
      .style('stroke-width', 2);

    // Create y-axis
    svg.append('line')
      .attr('x1', centerX)
      .attr('y1', 0)
      .attr('x2', centerX)
      .attr('y2', maxHeight)
      .style('stroke', 'black')
      .style('stroke-width', 2);

    if (data) {
      // DRAW NODES
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      data.nodesData.node.forEach((node) => {
        const cx = parseFloat(node.$.locX);
        const cy = parseFloat(node.$.locY);
        const nodeId = node.$.id;
        const nodeColor = colorScale(nodeId);
        const circleContainer = svg.append('g');
        circleContainer
          .append('circle')
          .attr('nodeId', nodeId)
          .attr('cx', centerX + cx)
          .attr('cy', centerY - cy)
          .attr('r', 0.3 * gridUnitSize)
          .attr('fill', nodeColor);
        // Append a title to the container
        circleContainer
          .append('title')
          .text(`Node ID: ${nodeId}`);
      });

      // ASSIGN MAC & IP's to Nodes/Circles
      data.nodesData.nonp2plinkproperties.forEach((nonp2plinkproperties) => {
        const nodeId = nonp2plinkproperties.$.id;
        const concatenatedIpMac = nonp2plinkproperties.$.ipAddress;
        const [ipv4, MAC] = concatenatedIpMac.split("~");
        // Exclude loopback ipv4 & MAC
        if (ipv4 !== '127.0.0.1' || MAC !== '00:00:00:00:00:00') {
          const circle = svg.select(`circle[nodeId="${nodeId}"]`);
          circle
            .attr('ipv4', ipv4)
            .attr('MAC', MAC);
        }
      });

      /***********************
      *   Run Simulation    *
      ***********************/

      if (startSimulationFlag) {
        // Call the startSimulation function when the flag is true
        startSimulation();
      }

      // Run the simulation
      async function startSimulation() {
        let currentTime = 0;
        for (const event of data.simulationData) {
          // Extract the time property based on the event type
          const eventTime = getEventTime(event);
          if (eventTime !== null) {
            const timeDifference = eventTime - currentTime;
            if (timeDifference > 0) {
              // Introduce a time delay (time step) based on the time difference
              await sleep(timeDifference);
            }
            currentTime = eventTime;
          }
          // Handle events 
          if ('$' in event && 'p' in event.$) {
            if (event.$.p === 'p') {
              handleNodeMovement(event);
            }
          } else if (event.type === 'connectionBroken') {
            // handleConnectionBroken(event);
          } else if ('$' in event && 'meta-info' in event.$ && event.$['meta-info'].includes('PeerLinkConfirmStart')) {
            handleConnectionEstablished(event);
          }
        }
      }

      // Function to extract the time property based on the event type
      function getEventTime(event) {
        if ('$' in event && 'fbTx' in event.$) {
          return parseFloat(event.$.fbTx);
        } else if ('$' in event && 't' in event.$) {
          return parseFloat(event.$.t);
        }
        return null;
      }

      // Function to introduce a time delay (time step)
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      // Function to handle connections established 
      function handleConnectionEstablished(event) {
        const metaInfo = event.$['meta-info'];
        const regex = /DA=([\w:]+), SA=([\w:]+)/;
        const match = metaInfo.match(regex);

        if (match) {
          const destinationMacAddress = match[2]; //(DA & SA flipped as we are parsing the return packet)
          const sourceMacAddress = match[1];

          const sourceNode = svg.select(`circle[MAC="${sourceMacAddress}"]`);
          const destinationNode = svg.select(`circle[MAC="${destinationMacAddress}"]`);

          svg.append('line')
            // SA Coords
            .attr('x1', parseFloat(sourceNode.attr('cx')))
            .attr('y1', parseFloat(sourceNode.attr('cy')))
            // DA Coords
            .attr('x2', parseFloat(destinationNode.attr('cx')))
            .attr('y2', parseFloat(destinationNode.attr('cy')))
            // Other Attributes
            .attr('sourceNode', sourceNode.attr('nodeId'))
            .attr('destinationNode', destinationNode.attr('nodeId'))
            .style('stroke', 'green')
            .style('stroke-width', 2);
        }
      }

      // Function to handle connections broken
      function handleConnectionBroken(event) {
        // Find and remove the line representing the broken connection
        svg.select('line')
          .filter(function (d) {
            const sourceNodeId = d3.select(this).attr('sourceNodeId');
            const targetNodeId = d3.select(this).attr('targetNodeId');
            return sourceNodeId === event.sourceNodeId && targetNodeId === event.targetNodeId;
          })
          .remove();
      }

      // Function to handle node movement
      function handleNodeMovement(event) {
        const x = parseFloat(event.$.x);
        const y = parseFloat(event.$.y);
        const nodeId = event.$.id;
        const circle = svg.select(`circle[nodeId="${nodeId}"]`);
        circle.attr('cx', centerX + x).attr('cy', centerY - y);
        handleLineMovement(nodeId);
      }

      // Function to correct edge postioning upon node movement
      function handleLineMovement(nodeId) {
        const selectedLines = svg.selectAll('line')
          .filter(function () {
            const sourceNodeId = d3.select(this).attr('sourceNode');
            const destinationNodeId = d3.select(this).attr('destinationNode');
            return sourceNodeId === nodeId || destinationNodeId === nodeId;
          });
          
          selectedLines.each(function () {
            const line = d3.select(this);
            const sourceNodeId = line.attr('sourceNode');
            const destinationNodeId = line.attr('destinationNode');
          

            if (sourceNodeId === nodeId) {
              // Update the coordinates x1 and y1 if sourceNode matches nodeId
              const sourceNode = svg.select(`circle[nodeId="${sourceNodeId}"]`);
              line
                .attr('x1', parseFloat(sourceNode.attr('cx')))
                .attr('y1', parseFloat(sourceNode.attr('cy')))
            }
        
            if (destinationNodeId === nodeId) {
              // Update the coordinates x2 and y2 if destinationNode matches nodeId
              const destinationNode = svg.select(`circle[nodeId="${destinationNodeId}"]`);
              line
                .attr('x2', parseFloat(destinationNode.attr('cx')))
                .attr('y2', parseFloat(destinationNode.attr('cy')))
            }
          });
        }



    }
  }, [data, maxWidth, maxHeight, startSimulationFlag]);

  return (
    <div>
      <svg ref={svgRef} width={maxWidth} height={maxHeight}></svg>
    </div>
  );
}

export default Visualization;




