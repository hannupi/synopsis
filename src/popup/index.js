import { getCaptions } from './captions.js';
import { generateResponse } from './chatgpt.js';
const { theme } = await browser.storage.sync.get("theme")
if (theme) document.body.classList.add("white-theme")


async function main() {
    const captions = await getCaptions()

    if (captions !== undefined) {
        generateResponse(captions)
    }
}

main()


