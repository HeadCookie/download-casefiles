import { existsSync, mkdirSync } from 'fs';
import path, { join } from 'path';
import { downloadDocument } from './apiUtils.js';
import { caseFileStatuses } from './constants.js';

export function createDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export async function processCaseFiles(caseFiles, apiBaseURL, baseDirectory, progressBar) {
  for (const caseFile of caseFiles) {
    const statusFolder = caseFileStatuses[caseFile.status];
    const safeTitle = caseFile.title.replace(/[/\\?%*:|"<>]/g, '-');
    const caseFolderPath = join(baseDirectory, statusFolder, `${caseFile.id} - ${safeTitle}`);

    createDirectory(caseFolderPath);

    for (const document of caseFile.documents) {
      const documentTitle = document.title.replace(/[/\\?%*:|"<>]/g, '-');
      const savePath = join(caseFolderPath, `${documentTitle}.pdf`);
      await downloadDocument(document.id, savePath, apiBaseURL);
    }
    progressBar.update(progressBar.value + 1);
  }
}

export function printClickableLink(filePath) {
  const absolutePath = path.resolve(filePath);

  const fileUrl = process.platform === 'win32' ? `file:///${absolutePath.replace(/\\/g, '/')}` : `file://${absolutePath}`;

  console.log(`File saved: ${fileUrl}`);
}

