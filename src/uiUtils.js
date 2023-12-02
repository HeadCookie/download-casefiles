import { keyInSelect, questionPath, question } from 'readline-sync';
import { createInterface } from 'readline';
import { setCredentials } from './credentialsManager.js';


export async function promptForCredentials() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const key = await new Promise(resolve => {
    rl.question('Enter key: ', (input) => {
      resolve(input);
    });
  });

  const secret = question('Enter secret: ', {
    hideEchoBack: true
  });

  setCredentials(key, secret);

  rl.close();
}

export function selectEnvironment() {
  console.log('Select Environment:');
  const environments = ['sandbox', 'production']
  const index = keyInSelect(environments, 'Which environment do you want to use?');
  return environments[index];
}

export function selectDownloadDirectory() {
  const directory = questionPath('Enter the path to the download directory: ', {
    isDirectory: true,
    exists: false,
  });
  return directory;
}

