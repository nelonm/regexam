import {z} from "zod"
import cors from "cors"
import express from "express"
import fs from "fs/promises"

const server = express()

server.use(cors())
server.use(express.json())

type User = {
    address: string,
    password: string,
    password2: string
}
const newAddress = z.object({
    address:z.string(),
    password:z.string(),
    password2:z.string()
})

const loadDB = async (filename: string) => {
    try {
      const rawData = await fs.readFile(`${__dirname}/../database/${filename}.json`, 'utf-8')
      const data = JSON.parse(rawData)
      return data as User[]
    } catch (error) {
      return null
    }
  }
  
  const saveDB = async (filename: string, data: any) => {
    try {
      const fileContent = JSON.stringify(data)
      await fs.writeFile(`${__dirname}/../database/${filename}.json`, fileContent)
      return true
    } catch (error) {
      return false
    }
  }
server.post("/signup", async (req, res) => {

    const result = newAddress.safeParse(req.body)
    if (!result.success)
      return res.status(400).json(result.error.issues)
    const newUser = result.data
  
    const users = await loadDB("users")
    if (!users)
      return res.sendStatus(500)
    for (const user of users) {
        if(user.address === newUser.address)
        return res.status(400).json("A felhsználónév foglalt")
    }
  
    const id = Math.random()
    const isSuccessful = await saveDB("users", [ ...users, { ...newUser, id } ])
  
    if (!isSuccessful)
      return res.sendStatus(500)
  
    res.json({ ...newUser, id })
  })




server.listen(4200)