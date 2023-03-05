const error = document.getElementById("error")
const reply = document.getElementById('reply-box');
const source = await browser.tabs.query({ active: true, currentWindow: true })
const sourceURL = source[0].url

export async function getCaptions() {
    try {
        reply.innerHTML = "<p> Loading...</p>"
        const sourceData = await fetch(sourceURL, {
            headers: {
                "Content-Type": "text/plain",
            },
        })
        const sourceHTML = await sourceData.text()

        const regex = /({"captionTracks":.*isTranslatable":(true|false)}])/;
        const [match] = regex.exec(sourceHTML);
        const { captionTracks } = JSON.parse(`${match}}`);
        const captionsURL = captionTracks[0].baseUrl;

        const captionsData = await fetch(captionsURL)
        let captions = await captionsData.text()
        captions = captions.replace(/<[^>]*>/g, '').replace(/&amp;#39;/g, '')
        return captions
    } catch (e) {
        reply.innerHTML = ""
        console.log("Captions not found")
        error.innerHTML = "<p> No captions found for this video</p>"
    }
}