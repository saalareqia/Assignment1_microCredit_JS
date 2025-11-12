// multiAuth.js
// Author: Ahmed Alareqi (updated)
// Description: Implements a one-time passcode (OTP) system with configurable duration.

// Store passcodes with expiry and an active timeout handle so durations can be reset.
const passcodes = new Map();

/**
 * generatePasscode(code, duration)
 * - code: integer (or string) representing the one-time passcode
 * - duration: duration in milliseconds (e.g. 5*60*1000 for five minutes)
 *
 * Behavior:
 * - If the same passcode exists and is still unexpired: overwrite its expiry (reset duration), return true.
 * - Otherwise create the passcode entry and return false.
 * - Passcodes are automatically removed after the duration.
 */
function generatePasscode(code, duration) {
  const now = Date.now();

  // Normalize code to string for Map key stability
  const key = String(code);

  if (passcodes.has(key)) {
    const entry = passcodes.get(key);
    if (now < entry.expiry) {
      // Reset expiry and timeout when a valid passcode is reused
      clearTimeout(entry.timeout);
      const newExpiry = now + duration;
      const timeout = setTimeout(() => passcodes.delete(key), duration);
      passcodes.set(key, { expiry: newExpiry, timeout });
      return true; // same unexpired passcode existed
    }
    // If expired (shouldn't normally happen because timeout deletes), fall-through to set new
  }

  // Create a new passcode entry
  const expiry = now + duration;
  const timeout = setTimeout(() => passcodes.delete(key), duration);
  passcodes.set(key, { expiry, timeout });
  return false;
}

/**
 * isValid(code)
 * - returns true if the given code exists and is still unexpired
 */
function isValid(code) {
  const key = String(code);
  if (!passcodes.has(key)) return false;
  return Date.now() < passcodes.get(key).expiry;
}

/**
 * getActivePasscodes()
 * - returns an array of objects: { code, expiresInMs }
 */
function getActivePasscodes() {
  const now = Date.now();
  const list = [];
  for (const [code, { expiry }] of passcodes.entries()) {
    list.push({ code, expiresInMs: Math.max(0, expiry - now) });
  }
  return list;
}

// Expose functions to the browser/global environment for the frontend
if (typeof window !== 'undefined') {
  window.MultiAuth = {
    generatePasscode,
    isValid,
    getActivePasscodes,
    DEFAULT_FIVE_MINUTES: 5 * 60 * 1000,
  };
}

// Node-style export (if used in Node environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generatePasscode, isValid, getActivePasscodes };
}
