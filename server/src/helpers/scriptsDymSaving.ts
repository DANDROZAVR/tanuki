import fs from 'fs'
import path from 'path'
function ensureDirectoryExistence(filePath : string) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}
export const saveJSToPath = (path: string, code: string) : Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, () => {
            ensureDirectoryExistence(path)
            fs.writeFile(path, code, {flag: 'wx'}, (err) => {
                if (err) {
                    console.error(err);
                    reject(err)
                } else {
                    console.log('File has been written.');
                    resolve(true)
                }
            })
        })
    })

}