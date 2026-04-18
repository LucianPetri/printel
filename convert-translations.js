#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to process
const translationsDir = path.join(__dirname, 'translations');
const languages = fs.readdirSync(translationsDir);

languages.forEach(lang => {
  const langDir = path.join(translationsDir, lang);
  const files = fs.readdirSync(langDir);

  files.forEach(file => {
    const filePath = path.join(langDir, file);
    const stat = fs.statSync(filePath);

    if (!stat.isFile()) return;

    // Only process JSON files
    if (!file.endsWith('.json')) return;

    const baseName = path.basename(file, '.json');
    const csvPath = path.join(langDir, `${baseName}.csv`);

    // Read JSON
    const jsonContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(jsonContent);

    // Convert to CSV
    const csvRows = [];
    csvRows.push('key,translation'); // Header

    Object.entries(jsonData).forEach(([key, value]) => {
      // Escape quotes and handle commas in CSV format
      const escapedValue = String(value)
        .replace(/"/g, '""') // Escape double quotes by doubling them
        .replace(/\n/g, ' '); // Replace newlines with space

      // Wrap in quotes if contains comma, newline, or quote
      const needsQuotes = escapedValue.includes(',') || 
                         escapedValue.includes('"') || 
                         escapedValue.includes('\n');

      if (needsQuotes) {
        csvRows.push(`"${key}","${escapedValue}"`);
      } else {
        csvRows.push(`${key},${escapedValue}`);
      }
    });

    // Write CSV
    fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf-8');
    console.log(`✓ Converted: ${lang}/${file} → ${baseName}.csv`);
  });
});

console.log('\n✅ Conversion complete! All JSON translations converted to CSV format.');
