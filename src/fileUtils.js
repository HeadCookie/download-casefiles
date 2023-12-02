import { existsSync, mkdirSync } from 'fs';
import path, { join } from 'path';
import { downloadDocument } from './apiUtils.js';
import { SingleBar, Presets } from 'cli-progress';
import { caseFileStatuses } from './constants.js';

export function createDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export async function processCaseFiles(caseFiles, apiBaseURL, baseDirectory) {
  const progressBar = new SingleBar({}, Presets.shades_classic);

  progressBar.start(caseFiles.length, 0);

  for (const [index, caseFile] of caseFiles.entries()) {
    const statusFolder = caseFileStatuses[caseFile.status];
    const safeTitle = caseFile.title.replace(/[/\\?%*:|"<>]/g, '-');
    const caseFolderPath = join(baseDirectory, statusFolder, `${caseFile.id} - ${safeTitle}`);

    createDirectory(caseFolderPath);

    for (const document of caseFile.documents) {
      const documentTitle = document.title.replace(/[/\\?%*:|"<>]/g, '-');
      const savePath = join(caseFolderPath, `${documentTitle}.pdf`);
      await downloadDocument(document.id, savePath, apiBaseURL);
    }
    progressBar.update(index + 1);
  }

  progressBar.stop();

  printClickableLink(baseDirectory);
}

function printClickableLink(filePath) {
  const absolutePath = path.resolve(filePath);

  const fileUrl = process.platform === 'win32' ? `file:///${absolutePath.replace(/\\/g, '/')}` : `file://${absolutePath}`;

  console.log(`File saved: ${fileUrl}`);
}

