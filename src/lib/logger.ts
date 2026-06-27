/**
 * Lightweight structured logging utility for server and client.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  context?: string;
  data?: any;
}

const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  info: (message: string, options?: LogOptions) => {
    if (isProduction) return; // Keep production logs clean of info messages
    console.log(`[INFO] ${options?.context ? `[${options.context}] ` : ''}${message}`, options?.data || '');
  },

  warn: (message: string, options?: LogOptions) => {
    console.warn(`[WARN] ${options?.context ? `[${options.context}] ` : ''}${message}`, options?.data || '');
  },

  error: (message: string, options?: LogOptions) => {
    // Errors should always be logged in production for monitoring
    console.error(`[ERROR] ${options?.context ? `[${options.context}] ` : ''}${message}`, options?.data || '');
  },

  debug: (message: string, options?: LogOptions) => {
    if (isProduction) return;
    console.debug(`[DEBUG] ${options?.context ? `[${options.context}] ` : ''}${message}`, options?.data || '');
  }
};
