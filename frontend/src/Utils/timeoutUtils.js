/**
 * Utility for handling timeouts and retries for API requests
 */

/**
 * Wraps a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} errorMsg - Error message to use when timeout occurs
 * @returns {Promise} A promise that rejects with timeout if the original promise doesn't resolve in time
 */
export const withTimeout = (promise, timeoutMs, errorMsg = 'Request timed out') => {
  let timeoutId;
  
  // Create a timeout promise that rejects after specified time
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMsg));
    }, timeoutMs);
  });
  
  // Race the original promise against the timeout
  return Promise.race([
    promise,
    timeoutPromise
  ]).finally(() => {
    clearTimeout(timeoutId);
  });
};

/**
 * Retry a function multiple times with delay between attempts
 * @param {Function} fn - The async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} retryDelayMs - Delay between retries in milliseconds (default: 500)
 * @param {boolean} exponentialBackoff - Whether to use exponential backoff for delays (default: true)
 * @returns {Promise} Result of the function call when successful
 */
export const withRetry = async (fn, maxRetries = 3, retryDelayMs = 500, exponentialBackoff = true) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error.message);
      lastError = error;
      
      if (attempt < maxRetries) {
        // Calculate delay for next attempt
        const delay = exponentialBackoff 
          ? retryDelayMs * Math.pow(2, attempt) 
          : retryDelayMs;
        
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError;
};

/**
 * Makes a fetch request with timeout and automatic retry
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeoutMs - Timeout in milliseconds (default: 5000)
 * @param {number} maxRetries - Maximum number of retries (default: 2)
 * @param {number} retryDelayMs - Delay between retries in milliseconds (default: 300)
 * @returns {Promise} The fetch response
 */
export const fetchWithTimeoutAndRetry = async (
  url, 
  options = {}, 
  timeoutMs = 5000, 
  maxRetries = 2,
  retryDelayMs = 300
) => {
  const fetchFn = () => withTimeout(
    fetch(url, options),
    timeoutMs,
    `Fetch request to ${url} timed out after ${timeoutMs}ms`
  );
  
  return withRetry(fetchFn, maxRetries, retryDelayMs);
};

export default {
  withTimeout,
  withRetry,
  fetchWithTimeoutAndRetry
};