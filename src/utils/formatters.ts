// src/utils/formatters.ts
/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale to use for formatting
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  locale: string = "en"
): string {
  if (!dateString) return "";

  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Format a date range (start - end)
 * @param startDate - Start date string
 * @param endDate - End date string or "Present"
 * @param locale - Locale to use for formatting
 * @returns Formatted date range
 */
export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date | "Present" | "Presente",
  locale: string = "en"
): string {
  const formattedStart = formatDate(startDate, locale);

  // Handle "Present" text based on locale
  if (endDate === "Present" || endDate === "Presente") {
    const present = locale.startsWith("es") ? "Presente" : "Present";
    return `${formattedStart} - ${present}`;
  }

  const formattedEnd = formatDate(endDate, locale);
  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Format a number to include thousands separators
 * @param num - Number to format
 * @param locale - Locale to use for formatting
 * @returns Formatted number string
 */
export function formatNumber(
  num: number | string | null | undefined,
  locale: string = "en"
): string {
  if (num === null || num === undefined) return "";

  const parsedNum = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(parsedNum)) {
    return "";
  }

  try {
    return new Intl.NumberFormat(locale).format(parsedNum);
  } catch (error) {
    console.error("Error formatting number:", error);
    return parsedNum.toString();
  }
}

/**
 * Format a duration in seconds to a human-readable format
 * @param seconds - Duration in seconds
 * @param locale - Locale for translations
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number, locale: string = "en"): string {
  if (!seconds || isNaN(seconds)) return "";

  // Less than a minute
  if (seconds < 60) {
    return locale.startsWith("es")
      ? `${seconds} segundos`
      : `${seconds} seconds`;
  }

  // Less than an hour
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return locale.startsWith("es")
      ? `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
      : `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  // Hours and minutes
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (locale.startsWith("es")) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}${
      minutes > 0 ? ` ${minutes} ${minutes === 1 ? "minuto" : "minutos"}` : ""
    }`;
  } else {
    return `${hours} ${hours === 1 ? "hour" : "hours"}${
      minutes > 0 ? ` ${minutes} ${minutes === 1 ? "minute" : "minutes"}` : ""
    }`;
  }
}

/**
 * Truncate a string to a certain length
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated string
 */
export function truncateString(
  str: string,
  maxLength: number = 100,
  suffix: string = "..."
): string {
  if (!str) return "";

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate a slug from a string
 * @param str - String to generate slug from
 * @returns Slugified string
 */
export function slugify(str: string): string {
  if (!str) return "";

  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Safely parse JSON
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    return fallback;
  }
}

// src/utils/validators.ts
/**
 * Validate an email address
 * @param email - Email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  // Simple regex for basic email validation
  // For production, consider more robust validation or a library
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate a URL
 * @param url - URL to validate
 * @returns Whether the URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (error) {
    return false;
  }
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns Whether the value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") return value.trim() === "";

  if (Array.isArray(value)) return value.length === 0;

  if (typeof value === "object") return Object.keys(value).length === 0;

  return false;
}

/**
 * Validate a string is within a length range
 * @param str - String to validate
 * @param minLength - Minimum length (default: 0)
 * @param maxLength - Maximum length (default: Infinity)
 * @returns Whether the string length is valid
 */
export function isValidLength(
  str: string,
  minLength: number = 0,
  maxLength: number = Infinity
): boolean {
  if (!str) return minLength === 0;

  const length = str.trim().length;
  return length >= minLength && length <= maxLength;
}
