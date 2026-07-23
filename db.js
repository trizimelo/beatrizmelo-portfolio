
import postgres from 'postgres'
const connectionString = 
  process.env.DATABASE_URL || 
  process.env.STORAGE_POSTGRES_URL || 
  'postgres://postgres:postgres@localhost:5432/postgres'

const sql = postgres(connectionString)

export default sql