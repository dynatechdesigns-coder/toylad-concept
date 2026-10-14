// Makes a bcrypt hash for the admin password.
//   npm run hash-password            prints the hash (to paste into Vercel)
//   npm run hash-password -- --save  writes it into .env instead, without printing it
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import bcrypt from 'bcryptjs'

const save = process.argv.includes('--save')
const prompt = createInterface({ input: process.stdin, output: process.stdout })
const password = (await prompt.question('Type the admin password, then press Enter: ')).trim()
prompt.close()

if (password.length < 10) {
  console.error('\nThat password is too short. Use at least 10 characters.')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
// Single quotes stop the $ signs in the hash being treated as variables.
const line = `ADMIN_PASSWORD_HASH='${hash}'`

if (save) {
  const current = existsSync('.env') ? readFileSync('.env', 'utf8') : ''
  const pattern = /^ADMIN_PASSWORD_HASH=.*$/m
  const next = pattern.test(current) ? current.replace(pattern, () => line) : `${current.trimEnd()}\n${line}\n`
  writeFileSync('.env', next)
  console.log('\nSaved ADMIN_PASSWORD_HASH in .env.')
} else {
  console.log('\nYour hash (paste this as the value of ADMIN_PASSWORD_HASH in Vercel):\n')
  console.log(hash)
  console.log('\nFor the local .env file, keep the single quotes:\n')
  console.log(line)
}
