import secrets from "./secrets.js"; // find a logical way to do this in web extension way

const button = document.getElementById('generator-btn');

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
            "Authorization": `Bearer ${secrets.APIKEY}`,
        },
        body: JSON.stringify({ "model": "gpt-3.5-turbo", "messages": [{ role: "user", content: `bullet point this: ${captions}` }] })
    })
    const data = await response.json()

    console.log(data)
    console.log(data.choices[0].message.content)

})