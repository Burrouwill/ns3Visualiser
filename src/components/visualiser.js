import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Visualization({ data }) {
  const svgRef = useRef();
  const gridSize = 1000; // Number of rows and columns
  const gridUnitSize = 10; // Size of each grid unit

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear the previous visualization
    svg.selectAll('*').remove();

    // Create horizontal grid lines
    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      svg.append('line')
        .attr('x1', -gridSize * gridUnitSize / 2)
        .attr('y1', i * gridUnitSize)
        .attr('x2', gridSize * gridUnitSize / 2)
        .attr('y2', i * gridUnitSize)
        .style('stroke', 'lightgray')
        .style('stroke-width', 1);
    }

    // Create vertical grid lines
    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      svg.append('line')
        .attr('x1', i * gridUnitSize)
        .attr('y1', -gridSize * gridUnitSize / 2)
        .attr('x2', i * gridUnitSize)
        .attr('y2', gridSize * gridUnitSize / 2)
        .style('stroke', 'lightgray')
        .style('stroke-width', 1);
    }

    if (data) {
      // Render nodes or other data on the grid
      data.nodesData.node.forEach((node) => {
        const cx = parseFloat(node.$.locX);
        const cy = parseFloat(node.$.locY);

        svg.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 5) // Adjust the size of the circles
          .attr('fill', 'green');
      });
    }
  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default Visualization;


