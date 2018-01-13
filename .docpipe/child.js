/**
 * @file: child
 * @author: Cuttle Cong
 * @date: 2018/1/6
 * @description: 
 */
require("colors")
var fs = require('fs')
//
// // 0            Reset / Normal	(all attributes off)
// // 31 in 30–37	Set foreground color
// // 39           Default foreground color
// var redStringUnicode = '\u001b[31maaa\u001b[39m'
var redStringAscii = '\u001b[31maaa\u001b[39m'
var redStr = "aaa".red

var x = '\u200C'
console.log(redStringAscii, redStringAscii.length)
console.log(redStr, redStr.length, x.length)
console.log(redStr, redStringAscii === redStr)
console.log(new Buffer(redStringAscii).toString(), new Buffer(redStr).toString())

fs.writeFileSync('./tmp', redStr)

console.log(process.env.SHELL)

// console.log('unicode :', redStringUnicode)
// console.log('unicode length:', redStringUnicode.length)  // 13
// console.log('ascii escape:', redStringAscii)
// console.log('ascii escape length:', redStringAscii.length)  // 12
// console.log('colors:', redStr)
// console.log('colors length:', redStr.length) // 13
// console.log(redStr === redStringAscii) // true
// console.log(redStr === redStringUnicode) // true
// console.log(redStringAscii === redStringUnicode) // true
