#==========================
#SETUP 
#==========================
import pandas as pd 
from pathlib import Path 
import mygene 

#CREATE FILE PATH 
file_path = Path(__file__).parent / "GSE90599_norm_counts_FPKM_GRCh38.p13_NCBI.tsv.gz"
output_json_path = Path(__file__).parent / "visualization_data.json"
vdata = pd.read_csv(file_path, sep="\t")
print(vdata.columns)
print (vdata.head(10))
print(vdata.shape)
print (vdata.info())

#==========================
# CLEAN DATA
#==========================
# Drop missing values
vdata = vdata.dropna()

# Identify numeric sample columns (excluding gene ID or symbol columns)
numeric_cols = vdata.select_dtypes(include=['number']).columns

# Filter to keep genes with a mean FPKM greater than 1
vdata = vdata[vdata[numeric_cols].mean(axis=1) > 1]
#==========================
# GET SYMBOLS FOR GENES 
#==========================
mg = mygene.MyGeneInfo()
gene_ids = [str(g) for g in vdata["GeneID"].tolist()]
gene_map = mg.querymany(gene_ids,
                        scopes="entrezgene",
                        fields ="symbol",
                        species = "human",
                        as_dataframe=True)
print(gene_map.columns.tolist())
print(f"Mapped {len(gene_map)} / {len(gene_ids)} genes to symbols")

# Filter out genes that were not mapped to symbols
gene_map = gene_map[~gene_map.index.duplicated(keep='first')]

# 4. Export to JSON (orient='records' creates a clean list of dictionaries)
vdata.to_json(output_json_path, orient="records", indent=2)

print(f"Successfully converted TSV.GZ to JSON at: {output_json_path}")








