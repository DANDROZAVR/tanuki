import fs from 'fs'
import path from 'path'

export const deleteFromPath = (path: string) : boolean => {
    if (!fs.existsSync(path)) {
        return false;
    }
    fs.unlinkSync(path)
    return true;
}