// scripts/post-build.js
// Copies manifest.json, background.js, content.js into the build/ folder after `npm run build`

const fs = require("fs");
const path = require("path");

const FILES = ["manifest.json", "background.js", "content.js"];

FILES.forEach((file) => {
  const src = path.join(__dirname, "..", "public", file);
  const dest = path.join(__dirname, "..", "build", file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} → build/`);
  } else {
    console.warn(`⚠ ${file} not found in public/`);
  }
});

console.log("\n✅ Extension build ready! Load the /build folder in Chrome.");
