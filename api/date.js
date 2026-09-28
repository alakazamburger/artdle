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
    
    // return date
    return response.status(200).json({
      date: date
    })

  } catch (error) {
    return response.status(500).json({
      error: "server error"
    })
  }
}