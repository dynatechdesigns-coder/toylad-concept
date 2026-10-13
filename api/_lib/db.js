import { MongoClient } from 'mongodb'
import { HttpError } from './http.js'

const DB_NAME = 'toylad'

// One client per warm serverless instance, shared by every request it serves.
export async function getDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new HttpError(503, 'The photo database is not set up yet.')

  if (!globalThis.__toyladMongo) {
    globalThis.__toyladMongo = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000 }).connect()
  }
  try {
    const client = await globalThis.__toyladMongo
    return client.db(DB_NAME)
  } catch (error) {
    globalThis.__toyladMongo = null
    throw error
  }
}
