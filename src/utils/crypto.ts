import { base64ToArrayBuffer, arrayBufferToBase64 } from './encoding';

// Generate a key pair for RSA-OAEP encryption
export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: arrayBufferToBase64(publicKey),
    privateKey: arrayBufferToBase64(privateKey),
  };
}

// Import a public key from base64 format
export async function importPublicKey(publicKeyBase64: string) {
  const binaryKey = base64ToArrayBuffer(publicKeyBase64);
  return await window.crypto.subtle.importKey(
    'spki',
    binaryKey,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

// Import a private key from base64 format
export async function importPrivateKey(privateKeyBase64: string) {
  const binaryKey = base64ToArrayBuffer(privateKeyBase64);
  return await window.crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['decrypt']
  );
}

// Encrypt data using a public key
export async function encryptData(data: string, publicKey: CryptoKey) {
  // Generate a random AES key for the actual encryption
  const aesKey = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt']
  );

  // Generate a random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the data with AES-GCM
  const encodedData = new TextEncoder().encode(data);
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    aesKey,
    encodedData
  );

  // Export the AES key
  const exportedAesKey = await window.crypto.subtle.exportKey('raw', aesKey);

  // Encrypt the AES key with RSA-OAEP
  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    exportedAesKey
  );

  // Return everything needed for decryption
  return {
    encryptedData: arrayBufferToBase64(encryptedData),
    encryptedKey: arrayBufferToBase64(encryptedKey),
    iv: arrayBufferToBase64(iv),
  };
}