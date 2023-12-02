import { join } from 'path';
import { fetchCaseFiles, generateHeaders } from './apiUtils.js';
import { createDirectory, processCaseFiles } from './fileUtils.js';
import { selectEnvironment, selectDownloadDirectory, promptForCredentials } from './uiUtils.js';
import { getCredentials } from './credentialsManager.js';
import { caseFileStatuses } from './constants.js';

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
    const { key, secret } = getCredentials();
    const headers = await generateHeaders(key, secret);

    try {
      const caseFiles = await fetchCaseFiles(apiBaseURL, headers);
      await processCaseFiles(caseFiles, apiBaseURL, downloadDirectory);
    } catch (error) {
      console.error('Error fetching casefiles:', error);
    }
  } catch (error) {
    console.error('Error generating headers:', error);
  }
}

main();

