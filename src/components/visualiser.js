import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Visualization({ data, maxWidth, maxHeight }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

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
            .attr('cx', centerX + cx)
            .attr('cy', centerY - cy)
            .attr('r', 0.3*gridUnitSize) 
            .attr('fill', nodeColor); // Set the fill color based on the node's ID
      
          // Append a title to the container
          circleContainer
            .append('title')
            .text(`Node ID: ${nodeId}`);
        });
      }
      
      
      
      
  }, [data, maxWidth, maxHeight]);

  return (
    <div>
      <svg ref={svgRef} width={maxWidth} height={maxHeight}></svg>
    </div>
  );
}

export default Visualization;




