import {createDB, getFirstFromCalendar, getUserID, insertUser} from "./sql/database";
import {parseExecute, parseInsert, parseSchedule} from "./parser";
import {dumpyConstant} from "./scheduler"
const main = async () => {
    createDB()
    console.log(dumpyConstant)
    //await insertUser('admin')
    //console.log(await getUserID('admin'))
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
    const date = await parseSchedule({
        user: "admin",
        title: "title",
        scheduleOptions: {
            tag: "once",
            once: "2023-04-13T19:05:00.000Z"
        }

    })

}
main()