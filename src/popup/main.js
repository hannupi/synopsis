
const button = document.getElementById('generator-btn');
const reply = document.getElementById('reply-box');
const token = document.getElementById('token-box');
const storage = await browser.storage.sync.get("apiKey")


button.addEventListener('click', async () => {
    const source = await browser.tabs.executeScript({
        code: "document.documentElement.outerHTML"
    })

    const regex = /({"captionTracks":.*isTranslatable":(true|false)}])/;
    const [match] = regex.exec(source);
    const { captionTracks } = JSON.parse(`${match}}`);
    const captionsURL = captionTracks[0].baseUrl;

    const captionsData = await fetch(captionsURL)
    let captions = await captionsData.text()
    captions = captions.replace(/<[^>]*>/g, '').replace(/&amp;#39;/g, '')
    console.log(captions)
    console.log("captions length", captions.length)

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
    // chatgpt-3.5-turbo price is $0.002/1k tokens currently (02/03/2023)
    const price = (usedTokens * 0.002 / 1000).toFixed(5)
    console.log(data)

    for (let i = 1; i < replyMessage.length; i++) {
        reply.innerHTML += "<p>" + "- " + replyMessage[i] + "</p>"
    }

    token.innerHTML = "<p> Tokens used for query: " + usedTokens + ` ($${price})` + "</p>"
})
