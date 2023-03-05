const storage = await browser.storage.sync.get("apiKey")
const reply = document.getElementById('reply-box');
const token = document.getElementById('token-box');

export async function generateResponse(captions) {
    try {

        if (storage.apiKey === undefined) {
            //reply.innerHTML = "<p> Error: No API key found. Please add your API key in the extension options. </p>"
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
                    content: `bullet point this: ${captions}`
                }]
            })
        })
        const data = await response.json()

        const replyMessage = data.choices[0].message.content.split("-")
        const usedTokens = data.usage.total_tokens
        const price = (usedTokens * 0.002 / 1000).toFixed(5) // chatgpt-3.5-turbo price is $0.002/1k tokens currently (02/03/2023)
        console.log(data)

        for (let i = 1; i < replyMessage.length; i++) {
            reply.innerHTML += "<p>" + "- " + replyMessage[i] + "</p>"
        }

        token.innerHTML = "<p> Tokens used for query: " + usedTokens + ` ($${price})` + "</p>"
    } catch (e) {
        console.log(e)
        //reply.innerHTML = "<p> Error: " + e + "</p>"
    }
}