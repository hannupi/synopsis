import { getCaptions } from './captions.js';
import { generateResponse } from './chatgpt.js';

async function main() {
    const captions = await getCaptions()

    if (captions !== undefined) {
        generateResponse(captions)
    }
}

main()


