// Minification for js, css, and html
const csso = require('csso');
const fs = require('fs');
const path = require('path')
const UglifyJS = require("uglify-js");
const DIR = path.join(__dirname, '../')


// Used to check if folders exist and if they don't it creates them
const createFolder = (folderPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(folderPath, { recursive: false }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve("done")
      }
    })
  })
}

async function folderCheck() {
    const files = await fs.promises.readdir(DIR)
    if(!files.includes('static')) {
        await createFolder(`${DIR}static`)
        await createFolder(`${DIR}static/unminified-static`)
        await createFolder(`${DIR}static/unminified-static/stylesheets`)
        await createFolder(`${DIR}static/unminified-static/scripts`)
        await createFolder(`${DIR}static/stylesheets`)
        await createFolder(`${DIR}static/scripts`)
        await createFolder(`${DIR}static/images`)
    }
}


// used to load the files within a directory as a text file. Returns the 
// file content and the file names as fileContent and fileNames respectively.
async function loadFiles(dir) {
    let fileContent = []
    
    const fileNames = await fs.promises.readdir(dir)
    if(fileNames.length != 0) {
        for(const idx in fileNames) {
            fileContent.push(await fs.promises.readFile(`${dir}/${fileNames[idx]}`, 'utf-8'))
        }
    
        return { fileContent: fileContent, fileNames: fileNames }
    } else return { fileContent: undefined, fileNames: undefined }
}

// // function to minify all css in the unminified css folder and save the minified css
// // to the public static folder
async function minifyCSS() {
    const dir = `${DIR}static/unminified-static/stylesheets`

    const { fileContent, fileNames } = await loadFiles(dir)

    if(fileNames === undefined)
        return

    for(const idx in fileNames) {
        const minifiedCss = csso.minify(fileContent[idx]).css
        const minifiedDir = `${DIR}/static/stylesheets/${fileNames[idx]}`

        const staticFiles = await fs.promises.readdir(`${DIR}/static/stylesheets/`)

        if(!staticFiles.includes(fileNames[idx])) {
            console.log(`[csso] Saving minified ${fileNames[idx]} to public static directory...`)
            await fs.promises.writeFile(minifiedDir, minifiedCss)
        } else if(staticFiles.includes(fileNames[idx])) {
            const staticFileContent = await fs.promises.readFile(`${DIR}/static/stylesheets/${fileNames[idx]}`, 'utf-8')
            if(minifiedCss != staticFileContent) {
                console.log(`[csso] Saving minified ${fileNames[idx]} to public static directory...`)
                await fs.promises.writeFile(minifiedDir, minifiedCss)
            }
        }
    }
}

// // function to minify all js in the unminified css folder and save the minified js
// // to the public static folder
async function minifyJS() {
    const dir = `${DIR}static/unminified-static/scripts`
    const { fileContent, fileNames } = await loadFiles(dir)

    if(fileNames === undefined)
        return

    for(const idx in fileNames) {
        const minifiedJS = UglifyJS.minify(fileContent[idx]).code
        const minifiedDir = `${DIR}/static/scripts/${fileNames[idx]}`

        const staticFiles = await fs.promises.readdir(`${DIR}/static/scripts`)

        if(!staticFiles.includes(fileNames[idx])) {
            console.log(`[UglifyJS] Saving minified ${fileNames[idx]} to public static directory...`)
            await fs.promises.writeFile(minifiedDir, minifiedJS)
        } else if(staticFiles.includes(fileNames[idx])) {
            const staticFileContent = await fs.promises.readFile(`${DIR}/static/scripts/${fileNames[idx]}`, 'utf-8')
            if(minifiedJS != staticFileContent) {
                console.log(`[UglifyJS] Saving minified ${fileNames[idx]} to public static directory...`)
                await fs.promises.writeFile(minifiedDir, minifiedJS)
            }
        }
    }
}

async function minification() {
    await folderCheck()
    await minifyCSS()
    await minifyJS()
}

minification()

module.exports = {
    minifyJS: minifyJS,
    minifyCSS: minifyCSS
}