// Prints a bcrypt hash for the admin password: npm run hash-password
import { createInterface } from 'node:readline/promises'
import bcrypt from 'bcryptjs'

const prompt = createInterface({ input: process.stdin, output: process.stdout })
const password = (await prompt.question('Type the admin password, then press Enter: ')).trim()
prompt.close()

if (password.length < 10) {
  console.error('\nThat password is too short. Use at least 10 characters.')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
console.log('\nYour hash (paste this as the value of ADMIN_PASSWORD_HASH in Vercel):\n')
console.log(hash)
console.log('\nFor the local .env file, keep the single quotes:\n')
console.log(`ADMIN_PASSWORD_HASH='${hash}'`)
