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
    const captions = await captionsData.text()
    console.log(captions
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;#39;/g, '')
    )
})





