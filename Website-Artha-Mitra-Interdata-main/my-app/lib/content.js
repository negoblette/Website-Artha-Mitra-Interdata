import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export function getContent(fileName) {
  const filePath = path.join(dataDir, `${fileName}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function updateContent(fileName, data) {
  const filePath = path.join(dataDir, `${fileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

export function updateSection(fileName, sectionKey, sectionData) {
  const content = getContent(fileName);
  content[sectionKey] = sectionData;
  return updateContent(fileName, content);
}
