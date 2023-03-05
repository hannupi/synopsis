const source = await browser.tabs.query({ active: true, currentWindow: true })
const sourceURL = source[0].url

export async function getCaptions() {
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
        const captionsURL = captionTracks[0].baseUrl;

        const captionsData = await fetch(captionsURL)
        let captions = await captionsData.text()
        captions = captions.replace(/<[^>]*>/g, '').replace(/&amp;#39;/g, '')
        return captions
    } catch (e) {
        console.log("Captions not found")
        //reply.innerHTML = "<p> No captions found </p>"
    }
}