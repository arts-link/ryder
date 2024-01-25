const atImport = require("postcss-import");
const tailwind = require("tailwindcss")("./tailwind.config.js");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [atImport, tailwind, autoprefixer],
};