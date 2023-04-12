import fs from 'fs'

export const saveJSToPath = (path: string, code: string) : Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, () => {
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