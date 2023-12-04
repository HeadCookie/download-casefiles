import { get } from 'https';
import { getCredentials } from './credentialsManager.js';
import { writeFileSync } from 'fs';

export async function downloadDocument(documentId, savePath, apiBaseURL) {
  const { key, secret } = getCredentials();
  const headers = await generateHeaders(key, secret);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: apiBaseURL,
      path: encodeURI(`/api/v3/documents/${documentId}/content?signed=true&decrypt=true`),
      method: 'GET',
      headers: headers
    };

    get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (!data) {
          console.warn(`No data received for document ${documentId}, skipping.`);
          resolve();
          return;
        }

        try {
          const response = JSON.parse(data);
          const buffer = Buffer.from(response.content, 'base64');
          writeFileSync(savePath, buffer, { encoding: 'binary' });
          resolve();
        } catch (error) {
          console.error('Error processing response:', error);
          reject(error);
        }
      });
    }).on('error', (e) => {
      console.error(`Error downloading document ${documentId}:`, e);
      reject(e);
    });
  });
}

export async function fetchCaseFiles(apiBaseURL, page, perPage = 100) {
  const { key, secret } = getCredentials();
  const headers = await generateHeaders(key, secret);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: apiBaseURL,
      path: `/api/v3/casefiles?per_page=${encodeURIComponent(perPage)}&page=${encodeURIComponent(page)}&ownedOnly=false`,
      method: 'GET',
      headers: headers,
    };

    get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          const caseFiles = response.map(({ id, title, documents, status }) => ({
            id,
            title,
            documents,
            status
          }));

          resolve(caseFiles);
        } catch (error) {
          console.error(`Error processing data on page ${page}:`, error);
          reject(error);
        }
      });
    }).on('error', (e) => {
      console.error(`Error on page ${page}:`, e);
      reject(e);
    });
  });
}

export async function getTotalCaseFileCount(apiBaseURL) {
  const { key, secret } = getCredentials();
  const headers = await generateHeaders(key, secret);
  const options = {
    hostname: apiBaseURL,
    path: encodeURI(`/api/v3/casefiles?per_page=1&page=1&ownedOnly=false`),
    method: 'GET',
    headers: headers,
  };

  try {
    const itemCount = await new Promise((resolve, reject) => {
      get(options, (res) => {
        res.on('data', () => {
        });
        res.on('end', () => {
          const count = parseInt(res.headers['x-penneo-item-count'], 10);
          resolve(count);
        });
      }).on('error', (e) => {
        reject(e);
      });
    });

    console.log(`Total casefiles: ${itemCount}`);
    return itemCount;
  }
  catch (error) {
    console.error(`Error getting casefile count`, error);
    throw error;
  }
}

export async function generateHeaders(key, secret) {
  try {

    const wsseModule = await import('wsse');
    const UsernameToken = wsseModule.UsernameToken;

    const token = new UsernameToken({
      username: key,
      password: secret,
    });

    return {
      'Authorization': 'WSSE profile="UsernameToken"',
      'X-WSSE': token.getWSSEHeader({ nonceBase64: true }),
      'Accept-charset': 'utf-8',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Error in generating headers:', error);
    throw error;
  }
}


