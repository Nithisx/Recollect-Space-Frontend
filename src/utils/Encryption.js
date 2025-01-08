// src/utils/encryption.js

export const CLIENT_ENCRYPTION_KEY = '12345678901234567890123456789012'; // Fixed 32-byte key

/**
 * Generates an AES-GCM encryption key derived from the provided password and salt.
 * @param {string} password - The encryption key password.
 * @param {Uint8Array} salt - A 64-byte salt.
 * @returns {Promise<CryptoKey>} - The derived AES-GCM key.
 */
export const generateEncryptionKey = async (password, salt) => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-512' // Must match backend
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypts a File object using AES-GCM with double encryption.
 * @param {File} file - The file to encrypt.
 * @returns {Promise<File>} - The encrypted file.
 */
export const clientEncrypt = async (file) => {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(64)); // 64 bytes
    const iv = crypto.getRandomValues(new Uint8Array(16)); // 16 bytes

    // Derive encryption key
    const key = await generateEncryptionKey(CLIENT_ENCRYPTION_KEY, salt);

    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Encrypt the file
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      fileBuffer
    );

    // Extract tag and ciphertext
    const encryptedArray = new Uint8Array(encryptedContent);
    const tag = encryptedArray.slice(-16); // Last 16 bytes
    const ciphertext = encryptedArray.slice(0, -16); // All but last 16 bytes

    // Combine salt, IV, tag, and ciphertext
    const combinedBuffer = new Uint8Array([
      ...salt,
      ...iv,
      ...tag,
      ...ciphertext
    ]);

    // Create a new Blob or File object with the encrypted data
    return new File([combinedBuffer], file.name, {
      type: 'application/octet-stream',
      lastModified: file.lastModified
    });
  } catch (error) {
    console.error('File Encryption error:', error);
    throw new Error('Failed to encrypt file');
  }
};

/**
 * Decrypts an encrypted File object using AES-GCM with double encryption.
 * @param {ArrayBuffer} encryptedData - The encrypted file data.
 * @returns {Promise<ArrayBuffer>} - The decrypted file data.
 */
export const clientDecrypt = async (encryptedData) => {
  try {
    // Fixed client encryption key
    const clientKey = CLIENT_ENCRYPTION_KEY;
    if (!clientKey) {
      throw new Error('Encryption key not found');
    }

    // Extract salt, IV, tag, and ciphertext from the encrypted data
    const dataArray = new Uint8Array(encryptedData);
    const salt = dataArray.slice(0, 64); // First 64 bytes
    const iv = dataArray.slice(64, 80); // Next 16 bytes
    const tag = dataArray.slice(80, 96); // Next 16 bytes
    const ciphertext = dataArray.slice(96); // Remaining bytes

    // Generate decryption key
    const key = await generateEncryptionKey(clientKey, salt);

    // Combine ciphertext and tag for decryption
    const combinedEncrypted = new Uint8Array([
      ...ciphertext,
      ...tag
    ]);

    // Decrypt the content
    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      combinedEncrypted
    );

    return decryptedContent;
  } catch (error) {
    console.error('File Decryption error:', error);
    throw new Error('Failed to decrypt file');
  }
};

/**
 * Encrypts a text string using AES-GCM with double encryption.
 * @param {string} text - The text to encrypt.
 * @returns {Promise<string>} - The encrypted text as a Base64 string.
 */
export const clientEncryptText = async (text) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const salt = crypto.getRandomValues(new Uint8Array(64)); // 64 bytes
    const iv = crypto.getRandomValues(new Uint8Array(16));  // 16 bytes

    // Generate encryption key using PBKDF2
    const key = await generateEncryptionKey(CLIENT_ENCRYPTION_KEY, salt);

    // Perform AES-GCM encryption
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );

    // Convert to Uint8Array
    const encryptedArray = new Uint8Array(encryptedContent);
    const tag = encryptedArray.slice(-16);  // Last 16 bytes (authentication tag)
    const ciphertext = encryptedArray.slice(0, -16);  // Ciphertext without the tag

    // Combine salt, IV, tag, and ciphertext into one buffer
    const combinedBuffer = new Uint8Array([
      ...salt,
      ...iv,
      ...tag,
      ...ciphertext
    ]);

    // Convert the combined buffer to a binary string
    const binaryString = String.fromCharCode(...combinedBuffer);

    // Encode the binary string as Base64
    const base64String = btoa(binaryString);

    return base64String;

  } catch (error) {
    console.error('Text Encryption error:', error);
    throw new Error('Failed to encrypt text');
  }
};



/**
 * Decrypts an encrypted Base64 text string using AES-GCM with double encryption.
 * @param {string} base64EncryptedText - The encrypted text as a Base64 string.
 * @returns {Promise<string>} - The decrypted original text.
 */
export const clientDecryptText = async (base64EncryptedText) => {
  try {
    // If base64EncryptedText is a Buffer, convert it to a Base64 string for the browser
    let base64String = base64EncryptedText;
    if (base64EncryptedText && base64EncryptedText.type === 'Buffer') {
      base64String = arrayBufferToBase64(base64EncryptedText.data);
    }

    // Decode the Base64 string to raw binary data
    const decodedString = atob(base64String);

    // Convert the decoded string to Uint8Array
    const combinedBuffer = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
      combinedBuffer[i] = decodedString.charCodeAt(i);
    }

    // Extract salt, IV, tag, and ciphertext from the combined buffer
    const dataArray = new Uint8Array(combinedBuffer);
    const salt = dataArray.slice(0, 64);  // First 64 bytes
    const iv = dataArray.slice(64, 80);   // Next 16 bytes
    const tag = dataArray.slice(80, 96);  // Next 16 bytes
    const ciphertext = dataArray.slice(96); // Remaining bytes

    // Generate the decryption key using the salt
    const key = await generateEncryptionKey(CLIENT_ENCRYPTION_KEY, salt);

    // Combine ciphertext and tag for decryption
    const combinedEncrypted = new Uint8Array([
      ...ciphertext,
      ...tag
    ]);

    // Perform AES-GCM decryption
    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      combinedEncrypted
    );

    // Decode the decrypted content into a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch (error) {
    console.error('Text Decryption error:', error);
    throw new Error('Failed to decrypt text');
  }
};

// Utility function to convert ArrayBuffer to Base64 string (for browser)
const arrayBufferToBase64 = (arrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const length = bytes.byteLength;
  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};



