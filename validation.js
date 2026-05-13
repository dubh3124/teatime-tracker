/**
 * Centralized rating validation module.
 * Provides consistent validation for brew ratings across the application.
 */

const RATING_MIN = 1;
const RATING_MAX = 5;

/**
 * Validates a rating value.
 * @param {number|string|undefined|null} rating - The rating to validate.
 * @returns {{ valid: boolean, message?: string }}
 *   - valid: true if rating is a valid integer between 1 and 5
 *   - message: user-friendly error message (only when invalid)
 */
function validateRating(rating) {
  if (rating === undefined || rating === null) {
    return { valid: false, message: 'Rating is required' };
  }

  const num = typeof rating === 'string' ? Number(rating) : rating;

  if (typeof num !== 'number' || isNaN(num)) {
    return { valid: false, message: 'Rating must be a numeric value' };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, message: 'Rating must be a whole number between 1 and 5' };
  }

  if (num < RATING_MIN) {
    return { valid: false, message: 'Rating must be at least 1' };
  }

  if (num > RATING_MAX) {
    return { valid: false, message: 'Rating must be at most 5' };
  }

  return { valid: true };
}

/**
 * Convenience function that returns true if the rating is valid, false otherwise.
 * @param {number|string|undefined|null} rating
 * @returns {boolean}
 */
function isValidRating(rating) {
  return validateRating(rating).valid;
}

module.exports = { validateRating, isValidRating, RATING_MIN, RATING_MAX };
