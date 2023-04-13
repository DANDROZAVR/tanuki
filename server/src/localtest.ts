import {createDB, insertUser} from "./database";
import {parseExecute, parseInsert} from "./parser";

const main = async () => {
    createDB()
    /*await insertUser('admin')
    await parseInsert({
        user: "admin",
        title: "title",
        source: "exports.start =  () => {\n" +
            "    console.log('hello world2')\n" +
            "}",
    })*/
    await parseExecute({
            user: "admin",
            title: "title",
        }
    )
}
main()