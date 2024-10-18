const fs = require("fs")
const filePath = "./dist/index.mjs"
const insertText = 'import"./index.css";'

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Write on file failed:", err)
    return
  }

  const newContent = insertText + data

  fs.writeFile(filePath, newContent, "utf8", (err) => {
    if (err) {
      console.error("Write on file failed:", err)
      return
    }
    console.log("Write on file done!")
  })
})
