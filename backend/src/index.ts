import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import axios from 'axios'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  next()
})

app.post('/', async (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' })
})

app.post('/leads', async (req: Request, res: Response) => {
  //get name and email from the request body
  const { name, email } = req.body
  const lead = await prisma.lead.create({
    data: {
      firstName: String(name),
      email: String(email),
    },
  })
  res.json(lead)
})

app.get('/leads/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const lead = await prisma.lead.findUnique({
    where: {
      id: Number(id),
    },
  })
  res.json(lead)
})

app.get('/leads', async (req: Request, res: Response) => {
  const leads = await prisma.lead.findMany()
  res.json(leads)
})

app.patch('/leads/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email } = req.body
  const lead = await prisma.lead.update({
    where: {
      id: Number(id),
    },
    data: {
      firstName: String(name),
      email: String(email),
    },
  })
  res.json(lead)
})

app.delete('/leads/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  await prisma.lead.delete({
    where: {
      id: Number(id),
    },
  })
  res.json()
})

app.post('/leads/:id/message', async (req: Request, res: Response) => {
  const { id } = req.params
  const { message } = req.body

  const lead = await prisma.lead.findUnique({
    where: {
      id: Number(id),
    },
  })

  const leadData = lead as { [key: string]: any }
  const fields: string[] = message.match(/{(.*?)}/g) || []

  const missingFields = fields.filter((field) => !leadData[field.slice(1, -1)])

  let enrichedMessage = ''

  // If there aren't missing fields, replace the variables with the lead data
  if (missingFields.length === 0) {
    enrichedMessage = message
    fields.forEach((field) => {
      const fieldName = field.slice(1, -1)
      enrichedMessage = enrichedMessage.replace(field, leadData[fieldName])
    })
  }

  const newLead = await prisma.lead.update({
    where: {
      id: Number(id),
    },
    data: {
      message: enrichedMessage,
    },
  })

  res.json(newLead)
})

app.post('/leads/:id/enrich-gender', async (req: Request, res: Response) => {
  const { id } = req.params

  const lead = await prisma.lead.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!lead) {
    return res.status(404).json({ message: 'Lead not found' })
  }

  // use genderize API to retrive the lead gener
  try {
    const response = await axios.get<{
      gender: string
      probability: number
      count: number
    }>(`https://api.genderize.io?name=${lead.firstName}`)
    const result = response.data

    if (result && result.gender) {
      const newLead = await prisma.lead.update({
        where: { id: Number(id) },
        data: { gender: String(result.gender) },
      })
      res.json(newLead)
    } else {
      res.status(404).json({ error: 'Gender not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to guess gender' })
  }
})

app.listen(4000, () => {
  console.log('Express server is running on port 4000')
})
