import { MongoClient } from 'mongodb'
import { HttpError } from './http.js'

const DB_NAME = 'toylad'
// Give up before the serverless function itself times out, so the caller still gets a JSON error.
const CONNECT_TIMEOUT_MS = 8000

// One client per warm serverless instance, shared by every request it serves.
export async function getDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new HttpError(503, 'The photo database is not set up yet.')

  if (!globalThis.__toyladMongo) {
    globalThis.__toyladMongo = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000 }).connect()
  }
  let timer
  const timeout = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error('Database connection timed out')), CONNECT_TIMEOUT_MS)
  })
  try {
    const client = await Promise.race([globalThis.__toyladMongo, timeout])
    clearTimeout(timer)
    return client.db(DB_NAME)
  } catch (error) {
    clearTimeout(timer)
    globalThis.__toyladMongo = null
    throw error
  }
}
