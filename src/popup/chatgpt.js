const storage = await browser.storage.sync.get("apiKey")
const loader = document.getElementById('loaderAnim');
const reply = document.getElementById('reply-box');
const token = document.getElementById('token-box');
const error = document.getElementById("error")

export async function generateResponse(payload) {
    try {
        if (storage.apiKey === undefined || storage.apiKey === "") {
            loader.style.display = "none"
            error.innerHTML = "<p> Error: No API key found. Please add your API key in the extension options. </p>"
            return
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storage.apiKey}`,
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo", "messages": [{
                    role: "user",
                    content: `bullet point this: ${payload}`
                }]
            })
        })
        const data = await response.json()

        if (!data.error && data.choices.length === 0) {
            console.log(data.error)
            error.innerHTML = `<p>${data.error.message}</p>`
            loader.style.display = "none"
            return
        }

        const replyMessage = data.choices[0].message.content.split("\n")
        const usedTokens = data.usage.total_tokens
        const price = (usedTokens * 0.002 / 1000).toFixed(5) // chatgpt-3.5-turbo price is $0.002/1k tokens currently (02/03/2023)

        loader.style.display = "none"
        for (let i = 0; i < replyMessage.length; i++) {
            reply.innerHTML += "<p>" + replyMessage[i] + "</p>"
        }

        token.innerHTML = "<p> Tokens used for query: " + usedTokens + ` / $${price}` + "</p>"
    } catch (e) {
        console.log(e)
        error.innerHTML = "<p>Error with the API key/endpoint</p>"
        loader.style.display = "none"
    }
}