async function drawLineChart() {
  const dataset = await d3.json("visualization_data.json");

  const samples = ['GSM2407510', 'GSM2407511', 'GSM2407512', 'GSM2407513'];
  const xAccessor = d => d.sample;
  const yAccessor = d => d.value;

  const getGeneSeries = (geneRow) =>
    samples.map(sample => ({ sample, value: geneRow[sample] }));

  // Pick a few genes to compare — adjust indices/GeneIDs as needed
  const geneNames = {
    100287102: "DDX11L1",
    653635: "WASH7P",
    107985730: "MIR1302-2HG"
  };
  const genesToPlot = [dataset[0], dataset[1], dataset[2], dataset[3]]; // Adjust indices as needed
  const seriesData = genesToPlot.map(geneRow => ({
    geneId: geneRow.GeneID,
    geneName: geneNames[geneRow.GeneID] || `Gene ${geneRow.GeneID}`,
    values: getGeneSeries(geneRow)
  }));

  const allValues = seriesData.flatMap(s => s.values.map(yAccessor));

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: { top: 40, right: 120, bottom: 50, left: 70 }
  };
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

  const xScale = d3.scalePoint()
    .domain(samples)
    .range([0, dimensions.boundedWidth])
    .padding(0.5);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(allValues))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))
    .curve(d3.curveCatmullRom.alpha(0.5));

  const colorPalette = ['#ff006e', '#3a86ff', '#ffbe0b', '#8338ec', '#06d6a0'];

  // Gradient per gene line
  const defs = bounds.append('defs');
  seriesData.forEach((series, i) => {
    const gradient = defs.append('linearGradient')
      .attr('id', `lineGradient-${i}`)
      .attr('x1', '0%').attr('x2', '100%')
      .attr('y1', '0%').attr('y2', '0%');

    gradient.selectAll('stop')
      .data([
        { offset: '0%', color: colorPalette[i % colorPalette.length] },
        { offset: '100%', color: colorPalette[(i + 1) % colorPalette.length] }
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);
  });

  seriesData.forEach((series, i) => {
    bounds.append('path')
      .datum(series.values)
      .attr('fill', 'none')
      .attr('stroke', `url(#lineGradient-${i})`)
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', lineGenerator);

    bounds.selectAll(`.point-${i}`)
      .data(series.values)
      .enter()
      .append('circle')
      .attr('class', `point-${i}`)
      .attr('cx', d => xScale(xAccessor(d)))
      .attr('cy', d => yScale(yAccessor(d)))
      .attr('r', 6)
      .attr('fill', '#ffffff')
      .attr('stroke', colorPalette[i % colorPalette.length])
      .attr('stroke-width', 2);
  });

  // Axes
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  bounds.append("g")
    .call(yAxisGenerator);

  // Axis labels
  bounds.append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.boundedHeight + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .text("Sample");

  bounds.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .text("FPKM (Normalized Expression)");

  // Chart title
  wrapper.append("text")
    .attr("x", dimensions.width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Gene Expression Across Samples");

  // Legend
  const legend = wrapper.append("g")
    .attr("transform", `translate(${dimensions.width - dimensions.margin.right + 20}, ${dimensions.margin.top})`);

  seriesData.forEach((series, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 22})`);

    legendRow.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", colorPalette[i % colorPalette.length]);

    legendRow.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .style("font-size", "12px")
      .text(`Gene ${series.geneId}`);
  });
}

drawLineChart();