import fs from 'node:fs';

// Absolute path to your JSON file
const filePath = "C:\\Users\\HP\\Downloads\\OneDrive\\Intro to Programming\\Line Chart\\visualization_data.json";

// Read and parse the file synchronously
const dataset = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log("Data loaded successfully!");
console.table(dataset[0]);