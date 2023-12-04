import { join } from 'path';
import { fetchCaseFiles, getTotalCaseFileCount } from './apiUtils.js';
import { createDirectory, processCaseFiles, printClickableLink } from './fileUtils.js';
import { selectEnvironment, selectDownloadDirectory, promptForCredentials } from './uiUtils.js';
import { caseFileStatuses } from './constants.js';
import { SingleBar, Presets } from 'cli-progress';

async function main() {
  const environment = selectEnvironment();
  if (environment === -1) {
    console.log('No environment selected. Exiting...');
    return;
  }

  const apiBaseURL = environment === 'sandbox' ? 'sandbox.penneo.com' : 'app.penneo.com';
  console.log(`Selected environment: ${environment}`);

  const downloadDirectory = selectDownloadDirectory();
  createDirectory(downloadDirectory);

  Object.values(caseFileStatuses).forEach(statusName => {
    createDirectory(join(downloadDirectory, statusName));
  });

  try {
    await promptForCredentials();
    const totalCaseFilesCount = await getTotalCaseFileCount(apiBaseURL);
    console.log(`Total casefiles: ${totalCaseFilesCount}`);
    console.log('Fetching casefiles...');

    const progressBar = new SingleBar({}, Presets.shades_classic);

    progressBar.start(totalCaseFilesCount, 0);
    let currentPage = 1;
    const perPage = 100;

    try {
      while (true) {
        const caseFiles = await fetchCaseFiles(apiBaseURL, currentPage, perPage);
        await processCaseFiles(caseFiles, apiBaseURL, downloadDirectory, progressBar);

        if (caseFiles.length < perPage) {
          break;
        }
        currentPage++;
      }

      progressBar.stop();
      console.log('Done!');
      printClickableLink(downloadDirectory);
    } catch (error) {
      console.error('Error fetching casefiles:', error);
    }
  } catch (error) {
    console.error('Error generating headers:', error);
  }
}

main();

