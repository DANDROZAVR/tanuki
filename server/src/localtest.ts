import {createDB, getFirstFromCalendar, insertUser} from "./sql/database";
import {parseExecute, parseInsert, parseSchedule} from "./parser";

const main = async () => {
    createDB()
    await insertUser('admin')
    await parseInsert({
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
    //console.log(date)
}
main()