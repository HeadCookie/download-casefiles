let credentials = null;

export function setCredentials(key, secret) {
  credentials = { key, secret };
}

export function getCredentials() {
  if (!credentials) {
    throw new Error("Credentials have not been set");
  }
  return credentials;
}

