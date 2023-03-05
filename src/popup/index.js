import { generateResponse } from './apiReply.js';
import { getCaptions } from './captions.js';

async function main() {
    const captions = await getCaptions()
    generateResponse(captions)
}

main()


