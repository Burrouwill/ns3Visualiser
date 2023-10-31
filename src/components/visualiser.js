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
      // Define a color scale for nodes
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      // Render nodes or other data on the grid
      data.nodesData.node.forEach((node) => {
        const cx = parseFloat(node.$.locX);
        const cy = parseFloat(node.$.locY);
        const nodeId = node.$.id;

        // Use the node's ID to select a unique color
        const nodeColor = colorScale(nodeId);

        const circleContainer = svg.append('g');

        // Append a circle to the container
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
      function startSimulation() {
        data.simulationData.forEach((event) => {
          // Handle nu (Node update) packets: 'c' == color, 's' == size?, 'p' == postional 
          if ('$' in event && 'p' in event.$) {
            // Handle the nu postional packets:
            if (event.$.p === 'p') {
              handleNodeMovement(event);
            }
            // Handle pr (Connection) packets: 
          } else if (event.type === 'connectionBroken') {
            //handleConnectionBroken(event);
          } else if (event.type === 'connectionEstablished') {
            //handleConnectionEstablished(event);
          }
        });
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




