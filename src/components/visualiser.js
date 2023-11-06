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
        if (ipv4 !== '127.0.0.1' || MAC !== '00:00:00:00:00:00'){
          const circle = svg.select(`circle[nodeId="${nodeId}"]`);
          circle
            .attr('ipv4', ipv4)
            .attr('MAC', MAC);
        }
      });

      /***********************
      *   Run Simulation    *
      ***********************/
      console.log(data.simulationData)
      console.log(data.nodesData)

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
            //handleConnectionEstablished(event);
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
        const sourceNodeId = event.sourceNodeId;
        const targetNodeId = event.targetNodeId;
        // Create a line between the source and target nodes
        svg.append('line')
          .attr('x1', /* calculate x position of source node */)
          .attr('y1', /* calculate y position of source node */)
          .attr('x2', /* calculate x position of target node */)
          .attr('y2', /* calculate y position of target node */)
          .style('stroke', 'green')
          .style('stroke-width', 2);
          // Should this be adding some stuff to a collection of all connections perhaps? So we can do some stats / determine hop neighbours later on? 
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




