import express from "express"
import mongoose from "mongoose"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

mongoose.connect(process.env.MONGO_URI)

const ContactSchema = new mongoose.Schema({
  number: { type: String, unique: true }
})

const Contact = mongoose.model("Contact", ContactSchema)

app.post("/save", async (req, res) => {
  try {
    const { number } = req.body
    if (!number) return res.json({ msg: "Enter number" })

    const exists = await Contact.findOne({ number })
    if (exists) return res.json({ msg: "Duplicate" })

    await Contact.create({ number })
    const count = await Contact.countDocuments()
    res.json({ msg: "Saved", count })

  } catch {
    res.json({ msg: "Error" })
  }
})

app.get("/count", async (req, res) => {
  const count = await Contact.countDocuments()
  res.json({ count })
})

app.listen(3000, () => console.log("Server running"))
