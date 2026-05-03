export default async (req) => {
  try {
    const body = await req.json()
    
    const messages = [
      {
        role: "system",
        content: "You are an operations manager analyzing staff call-off patterns for a school district food service. Identify: 1) Staff who called off multiple times - name them and how many times. 2) Suspicious patterns like always calling off Mondays or Fridays. 3) Schools with high rates. 4) NCNS incidents. Be direct, specific, name actual people and schools. 3-4 sentences max."
      },
      ...body.messages
    ]

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 1000,
        messages: messages
      })
    })
    
    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || null
    return Response.json({ content: [{ text }] })
  } catch(e) {
    console.error("Error:", e)
    return Response.json({ content: [{ text: null }] })
  }
}

export const config = { path: "/api/chat" }