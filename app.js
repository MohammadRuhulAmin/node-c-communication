const { spawn } = require('node:child_process');
const { log } = require('node:console');
const fs = require('node:fs');

// Compile the C code
const compiler = spawn("gcc", ["./number_formatter.c", "-o", "numberFormatter"]);

/**Ensuring the compilation is completed */
compiler.on("close", (code) => {
    if (code === 0) {
        log("Compilation successful!");

        // Once compiled, execute numberFormatter
        const numberFormatter = spawn("./numberFormatter", ["public/dest.txt"]);
        
        numberFormatter.stdout.on("data", (data) => {
            log(data.toString());
        });

        numberFormatter.on("close", (exitCode) => {
            log(`numberFormatter exited with code ${exitCode}`);
        });
        // Pipe input file to numberFormatter's stdin
        const fileStream = fs.createReadStream("./public/src.txt");
        fileStream.pipe(numberFormatter.stdin,{end:false});    
        fileStream.on('end',()=>{
            numberFormatter.stdin.write("\nWriting manually from the stdin");
            numberFormatter.stdin.end("\nOk END!");
            
        })
        
    } else {
        log(`Compilation failed with exit code ${code}`);
    }
});
