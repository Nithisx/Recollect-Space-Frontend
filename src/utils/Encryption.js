// src/utils/encryption.js

export const CLIENT_ENCRYPTION_KEY = '12345678901234567890123456789012'; // Fixed 32-byte key

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

export const clientEncrypt = async (file) => {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(64)); // 64 bytes
    const iv = crypto.getRandomValues(new Uint8Array(16)); // 16 bytes

    // Use the fixed client encryption key
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
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt file');
  }
};

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
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt file');
  }
};
