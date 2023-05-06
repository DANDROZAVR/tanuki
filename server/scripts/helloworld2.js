const {helloworld} = require('../tanuki-scripts')
const {getRandomNumber} = require("../tanuki-scripts");

exports.start =  async () => {
    //console.log(getRandomNumber(10, 10))
    const tokenName = 'STG'
    const text = `Balance: 0.123 ${tokenName}`;
    const usdcIndex = text.indexOf(tokenName); // Find the index of the "USDC" string
    console.log(text.slice(9, usdcIndex))
    const usdcAmount = parseFloat(text.slice(9, usdcIndex).trim()); // Extract the substring containing the USDC amount and convert it to a number
    console.log(usdcAmount); // 11.00
}
exports.start()
// CAN'T WRITE HERE. tudududu. tudu. tudu CAN'T WRITE HERE