const {spawn} = require('node:child_process')
const { log } = require('node:console')
const fs = require('node:fs/promises')

const numberFormatter = spawn("number_formatter",["./dest.txt", '$',','])
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