import { createInterface } from 'readline';
import { question } from 'readline-sync';

async function generateHeaders(key, secret) {
  const wsseModule = await import('wsse');
  const UsernameToken = wsseModule.UsernameToken;

  const token = new UsernameToken({
    username: key,
    password: secret,
    nonceBase64: true,
  });

  return {
    'Authorization': 'WSSE profile="UsernameToken"',
    'X-WSSE': token.getWSSEHeader(),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}

async function main() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter key: ', (key) => {
    const secret = question('Enter secret: ', {
      hideEchoBack: true
    });

    rl.close();

    generateHeaders(key, secret).then(headers => {
      console.log(headers);
    }).catch(error => {
      console.error('Error generating headers:', error);
    });
  });
}

main();

