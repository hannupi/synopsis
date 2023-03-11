import { generateResponse } from './chatgpt.js';
import { createPayload } from './payload.js';
const { theme } = await browser.storage.sync.get("theme")
if (theme) document.body.classList.add("white-theme")


async function main() {
    const payload = await createPayload()

    if (payload !== undefined) {
        generateResponse(payload)
    }
}

main()


