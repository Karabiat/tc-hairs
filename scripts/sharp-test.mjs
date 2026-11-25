import sharp from "sharp";
import fs from "node:fs/promises";

await fs.mkdir("public/images", { recursive: true });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><linearGradient id="g"><stop stop-color="#FF5A00"/><stop offset="1" stop-color="#0A0A0A"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`;
const info = await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile("public/images/_test.jpg");
console.log(info);
