// node!
import {MongoClient} from "mongodb"

export default async function handler(request, response) {
  // cors blah blah
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS")
  response.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // preflight browser check
  if (request.method === "OPTIONS") {
    return response.status(200).end()
  }

  // nothing except post reqs
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "that method isn't allowed. stop it!"
    })
  }

  try {
    // safely parse the body in case it's a raw string or undefined
    let body = request.body
    
    if (typeof body === "string") {
      try {
        body = JSON.parse(body)
      } catch {
        return response.status(400).json({ error: "ahem, that's not json" })
      }
    }

    if (!body || !body.hint) {
      return response.status(400).json({error: "missing the 'hint' property. send a better request next time"})
    }

    const inp = body.hint
    const row = body.row

    if (!Number.isInteger(row) || row < 0 || row >= 6) {
      return response.status(400).json({error: "that's not a valid row. stop tampering!"})
    }

    // get the date! (running on server so not spoofable)
    const now = new Date()
    const date = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`

    // connect to mongodb
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db("artdle_db")
    const coll = db.collection("words")

    // check against db (either returns the word or null)
    const result = await coll.findOne({
      dates: date,
      hints: inp
    })

    // immediately close the connection
    await client.close()

    // not the intended word?
    if (!result || result.hints[row] !== inp) {
      return response.status(200).json({})
    }

    // get the colours!
    const colArr = calcColours(inp, result.word)

    // tell the frontend the result
    return response.status(200).json({
      colours: colArr
    })

  } catch (error) {
    return response.status(500).json({
      error: "server error"
    })
  }
}



// work out square colours (safely on the backend)
function calcColours(guess, target) {
  const targetArr = target.split('')
  const guessArr = guess.split('')
  const arr = ["","","","",""]

  for (let n = 0; n < 5; n++) {
    if (targetArr[n] === guessArr[n]) {
      // green
      arr[n] = "green"
      targetArr[n] = "" // removes potential for double counting it when doing yellows
    }
  }

  // must happen AFTER all greens are found (consider the As in 'APART' tested against 'PLACE')
  for (let n = 0; n < 5; n++) {
    if (arr[n] !== "") continue // must be another colour - do NOT overwrite this

    if (targetArr.includes(guessArr[n])) {
      // yellow
      arr[n] = "yellow"
      targetArr[targetArr.indexOf(guessArr[n])] = ""

    } else {
      // grey
      arr[n] = "grey"
    }
  }

  return arr
}