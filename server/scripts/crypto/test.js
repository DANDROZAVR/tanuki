const { configureDappeteer } = require("../../tanuki-scripts");
const {configurePupeteer} = require("../../tanuki-scripts");

const start = async () => {
    configureDappeteer('seed', false)
    /*await configurePupeteer("new", ['smth'], {
        url: 'smth',
        port: '334'
    })*/
}
start()
