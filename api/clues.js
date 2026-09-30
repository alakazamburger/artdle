import {MongoClient} from "mongodb"

export default async function handler(request, response) {
  // cors blah blah
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS")
  response.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // preflight browser check
  if (request.method === "OPTIONS") {
    return response.status(200).end()
  }

  // nothing except post reqs
  if (request.method !== "GET") {
    return response.status(405).json({
      error: "that method isn't allowed. stop it!"
    })
  }

  try {
    // get the date! (running on server so not spoofable)
    const now = new Date()
    const date = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`

    // connect to mongodb
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db("artdle_db")
    const coll = db.collection("words")

    // check against db
    const result = await coll.findOne(
      {dates: date},
      {projection: {_id: 0, clues: 1}}
    )

    // immediately close the connection
    await client.close()

    // no clues?
    if (!result?.clues) {
      return response.status(200).json({})
    }

    // pass clues to the frontend
    return response.status(200).json({
      clues: result.clues
    })

  } catch (error) {
    return response.status(500).json({
      error: "server error"
    })
  }
}