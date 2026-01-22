/**
 * Logger Utility
 *
 * Provides consistent console logging with the [Portflow Extended] prefix.
 */

const PREFIX = "[Portflow Extended]"

export const logger = {
  info: (msg: string, ...args: any[]) => console.log(`ℹ️ ${PREFIX} ${msg}`, ...args),

  success: (msg: string, ...args: any[]) => console.log(`✅ ${PREFIX} ${msg}`, ...args),

  warn: (msg: string, ...args: any[]) => console.warn(`⚠️ ${PREFIX} ${msg}`, ...args),

  error: (msg: string, ...args: any[]) => console.error(`❌ ${PREFIX} ${msg}`, ...args),

  debug: (msg: string, ...args: any[]) => {
    // Uncomment for detailed debug logs
    // console.log(`🔍 ${PREFIX} ${msg}`, ...args)
  },

  table: (title: string, data: any[]) => {
    console.log(`📊 ${PREFIX} ${title}`)
    if (data.length > 0) {
      console.table(data)
    } else {
      console.log(`(No data)`)
    }
  },
}
