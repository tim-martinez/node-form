import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { promises as fs } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3000
const DATA_DIR = '/var/www/facility-form-data'
const SUBMISSIONS_FILE = join(DATA_DIR, 'submissions.json')

app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read submissions from file
async function readSubmissions() {
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Write submissions to file
async function writeSubmissions(submissions) {
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/submit', async (req, res) => {
  try {
    await ensureDataDir()

    const submission = {
      id: Date.now().toString(),
      ...req.body,
      submittedAt: new Date().toISOString()
    }

    const submissions = await readSubmissions()
    submissions.push(submission)
    await writeSubmissions(submissions)

    res.json({
      success: true,
      message: 'Form submitted successfully',
      id: submission.id
    })
  } catch (error) {
    console.error('Error saving submission:', error)
    res.status(500).json({
      success: false,
      message: 'Error saving submission'
    })
  }
})

app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await readSubmissions()
    res.json(submissions)
  } catch (error) {
    console.error('Error reading submissions:', error)
    res.status(500).json({
      success: false,
      message: 'Error reading submissions'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
