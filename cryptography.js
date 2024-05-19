/**
 *  Basic cryptography 
 *  Encryption and Decryption 
 * 
 */

import crypto from 'crypto';

// Create hash using SHA algorithm
const hash = crypto.createHash('sha256');
hash.update('sameerlimbu');
console.log(`Hashed: ${hash.digest('hex')}`);


// Create Random Bytes
// crypto.randomBytes(16, (err, buf) => {
//     if (err) throw err;
//     console.log(buf.toString('hex'));
// });

// Define the algorithm, key, and initialization vector (iv)
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 32 bytes for AES-256
const iv = crypto.randomBytes(16);  // 16 bytes for AES block size

// Function to encrypt message
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Function to decrypt message
function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Example usage
const message = 'sameer';
const encryptedMessage = encrypt(message);
const decryptedMessage = decrypt(encryptedMessage);

console.log(`Encrypted message : ${encryptedMessage}`);
console.log(`Decrypted message : ${decryptedMessage}`);