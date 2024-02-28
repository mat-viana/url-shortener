import sqlite3 from 'sqlite3'
import { open, type Database } from 'sqlite'

sqlite3.verbose()

let database: Database | null = null

export async function setupDatabase (): Promise<Database> {
  try {
    if (database === null) {
      database = await open({
        filename: './src/database/url-shortener.db',
        driver: sqlite3.Database
      })

      await database.exec(`
        DROP TABLE IF EXISTS urls;
        CREATE TABLE urls (
          id TEXT PRIMARY KEY,
          original_url TEXT NOT NULL,
          short_url TEXT NOT NULL,
          short_url_key TEXT NOT NULL UNIQUE,
          total_access INTEGER DEFAULT 0
        );
      `)

      console.log('Database setup successful.')
    }

    if (database === null) {
      throw new Error('Database instance is null after setup.')
    }

    return database
  } catch (error) {
    console.error('Error setting up database:', error)
    throw error
  }
}

export function getDatabase (): Database {
  if (database === null) {
    throw new Error('Database instance is not initialized.')
  }
  return database
}
