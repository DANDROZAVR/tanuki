import {
    createDB,
    getFirstFromCalendar,
    getUserID,
    insertUser,
    insertScriptByName,
    getScriptByName,
    getScriptByUserID
} from "./sql/database";
import {parseExecute, parseInsert, parseSchedule} from "./parser";
import {dumpyConstant} from "./scheduler"
const main = async () => {
    createDB()
    //await insertUser("admin")
    /*await parseInsert({
        user: "admin",
        title: "title",
        source: "exports.start =  () => {\n" +
            "    console.log('hello world2')\n" +
            "}",
    })*/
    //const script : any = (await getScriptByUserID("title", 1))
    //console.log(script)
    /*await parseExecute({
            user: "admin",
            title: "title",
        }
    )*/
    //console.log(await getFirstFromCalendar())
    console.log(dumpyConstant)
    const date = await parseSchedule({
        user: "admin",
        title: "title",
        scheduleOptions: {
            tag: "once",
            once: "2023-04-18 10:46:40"
        }
    })

}
main()