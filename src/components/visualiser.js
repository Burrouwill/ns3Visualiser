import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Visualization({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    if (!data) {
      svg.selectAll('*').remove();
      return;
    }

    // Your D3.js code to render nodes based on the data
    data.nodesData.node.forEach((node) => {
      const cx = parseFloat(node.$.locX);
      const cy = parseFloat(node.$.locY);

      svg.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 10)
        .attr('fill', 'green');
    });


    // You can add more visualization logic as needed
  }, [data]);

  return (
    <div>
      <h2>Visualization</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default Visualization;

