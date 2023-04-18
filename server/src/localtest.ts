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
    const script : any = (await getScriptByUserID("script1-3-2023-13-55-38.tnk", 3))
    console.log(script)
    //console.log(dumpyConstant)

    /*await parseInsert({
        user: "admin",
        title: "title",
        source: "exports.start =  () => {\n" +
            "    console.log('hello world2')\n" +
            "}",
    })
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