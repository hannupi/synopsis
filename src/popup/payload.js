const error = document.getElementById("error")
const loader = document.getElementById('loaderAnim');
const source = await browser.tabs.query({ active: true, currentWindow: true })
const sourceURL = source[0].url

async function getContent() {
    switch (true) {
        case (/youtube/.test(sourceURL)):
            try {

                const sourceData = await fetch(sourceURL, {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                })
                const sourceHTML = await sourceData.text()

                const regex = /({"captionTracks":.*isTranslatable":(true|false)}])/;
                const [match] = regex.exec(sourceHTML);
                const { captionTracks } = JSON.parse(`${match}}`);
                // in case there are multiple languages, you can use the languageCode to find the one you want
                const engCaptions = captionTracks.find((track) => track.languageCode === "en")

                const captionsData = await fetch(engCaptions.baseUrl)
                let captions = await captionsData.text()
                captions = captions.replace(/<[^>]*>/g, '').replace(/&amp;#39;/g, '')
                return captions;
            } catch (e) {
                error.innerHTML = "<p>No captions found for this URL</p>"
                loader.style.display = "none"
                return
            }

        default:
            const textContent = await browser.tabs.executeScript({
                code: "const collection = document.getElementsByTagName('p'); const arr = Array.from(collection); const text = arr.map((p) => p.innerText).join(' '); text"
            })
            return textContent[0]
    }

}

export async function createPayload() {
    try {
        const siteContent = getContent()
        return siteContent
    } catch (e) {
        console.log("Captions not found")
        error.innerHTML = "<p>No captions found for this URL</p>"
        loader.style.display = "none"
    }
}