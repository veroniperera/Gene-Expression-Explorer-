# Gene-Expression-Explorer-
Interactive D3.js visualization tool for exploring normalized gene expression (FPKM) across 4 genes from a public GEO dataset (GSE90599), featuring dynamic multi-gene and gradient-style charting. 
## Live Demo 
[View Live] [https://veroniperera.github.io/Gene-Expression-Explorer-/]

##Screenshot 
!Gene expression explorer screenshot 
[Screenshot 2026-09-07 160949.png]

## How it works 
1. Loads `visualization_data.json` (after data cleaning from the orgininal normalized FPKM file).
2. Populates a multi-select dropdown with genes that have a known gene symbol.
3. On selection, reshapes each selected gene's row into per-sample data points.
4. Renders a D3.js line chart with gradient strokes, point markers, axes, and
a legend.

## What I Learned
- Debugging the Node.js vs. browser environment split (fetch/CORS behavior
  differs completely between the two)
- Structuring D3 scales, accessors, and line generators from raw JSON data
- Handling asynchronous data loading with `async/await` before rendering
- Git/GitHub workflow: resolving push rejections, merging unrelated histories,
  fixing remote URLs

## Future Improvements
- Expand the `geneNames` lookup to cover more genes in the dataset
- Add tooltips showing exact FPKM values on hover
- Let users search genes by name instead of scrolling a fixed list
- Add unit toggle (linear vs. log scale) for expression values
   
