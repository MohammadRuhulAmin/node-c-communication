const {spawn} = require('node:child_process')
const { log } = require('node:console')
const fs = require('node:fs')

const numberFormatter = spawn("number_formatter",["./dest.txt", '$',','])
/** To run a node file instead of running binary executable file 
 * numberFormatter = spawn("node",["app.js","./dest.txt","$",","])
 * Inside the bracket these are the arguments
*/
numberFormatter.stdout.on(data,(data)=>{
    log(data)
})

numberFormatter.stderr.on(data,(data)=>{
    log(`stderr: ${data}`)
})
numberFormatter.on("close",(code)=>{
    if(code === 0 )log('process successful')
    else log('process unsuccessful')
})

(async()=>{
  
    const fileStream = fs.createReadStream()
    fileStream.pipe(numberFormatter.stdin)
})()