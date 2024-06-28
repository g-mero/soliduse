const fs = require('node:fs')
const path = require('node:path')

const aliasMap = {
  '@': 'src',
}

// Function to replace alias with relative paths
function replaceAlias(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')

  for (const alias in aliasMap) {
    const aliasPath = path.resolve(aliasMap[alias].replace('src', 'dist'))
    const relativePath = path.relative(path.dirname(filePath), aliasPath)
    const regex = new RegExp(alias, 'g')
    content = content.replace(regex, relativePath)
  }

  fs.writeFileSync(filePath, content, 'utf8')
}

// Recursively process directories
function processDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      processDir(fullPath)
    }
    else if (fullPath.endsWith('.d.ts')) {
      replaceAlias(fullPath)
    }
  })
}

// Assuming generated declaration files are in 'dist' directory
processDir('dist')
