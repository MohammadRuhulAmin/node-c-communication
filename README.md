# Node.js and C Communication Example

This project demonstrates how to create a child process in Node.js to execute a C application. The C application reads input from a file, processes it, and writes the output to another file. This example highlights the interaction between Node.js and a C program using the `node:child_process` module.
<div style="text-align: center;">
  <img src="public/diagram.png" width="500" height="300" />
</div>


## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [How It Works](#how-it-works)
5. [Running the Project](#running-the-project)
6. [Code Explanation](#code-explanation)
7. [Conclusion](#conclusion)

## Overview

In this project, we use Node.js to:
1. Compile a C program using the `gcc` compiler.
2. Execute the compiled C binary.
3. Stream data from a source file to the C program's standard input (`stdin`).
4. Capture the output from the C program and write it to a destination file.

The C program reads input from `stdin`, processes it, and writes the output to a file specified by the user.

## Prerequisites

Before running this project, ensure you have the following installed:
- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
- **GCC Compiler**: Ensure `gcc` is installed on your system. You can install it using your package manager (e.g., `apt-get` for Ubuntu, `brew` for macOS).

## Project Structure

The project has the following structure:
```
node-c-communication/
├── public/
│   ├── src.txt          # Source file containing input data
│   ├── dest.txt         # Destination file for processed output
│   └── diagram.png      # Diagram illustrating the workflow
├── number_formatter.c   # C program for processing input
├── index.js             # Node.js script to compile and run the C program
└── README.md            # Project documentation
```

## How It Works

1. **Node.js Script**:
   - The Node.js script (`index.js`) uses the `spawn` function from the `node:child_process` module to compile the C program (`number_formatter.c`) into a binary executable (`numberFormatter`).
   - Once the C program is compiled, the script executes the binary and streams data from `public/src.txt` to the C program's `stdin`.
   - The C program reads the input, processes it, and writes the output to `public/dest.txt`.

2. **C Program**:
   - The C program (`number_formatter.c`) reads characters from `stdin` and writes them to a file (`public/dest.txt`).
   - It uses standard C functions like `fgetc`, `fprintf`, and `fflush` to handle input and output.

## Running the Project

1. Clone the repository or download the project files.
2. Navigate to the project directory:
   ```bash
   cd node-c-communication
   ```
3. Run the Node.js script:
   ```bash
   node index.js
   ```
4. Check the output in `public/dest.txt`.

## Code Explanation

### Node.js Code (`index.js`)

```javascript
const { spawn } = require('node:child_process');
const { log } = require('node:console');
const fs = require('node:fs');

// Compile the C code
const compiler = spawn("gcc", ["./number_formatter.c", "-o", "numberFormatter"]);

/** Ensuring the compilation is completed */
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
        fileStream.pipe(numberFormatter.stdin);

    } else {
        log(`Compilation failed with exit code ${code}`);
    }
});
```

- **Compilation**: The `spawn` function is used to compile the C program (`number_formatter.c`) into a binary (`numberFormatter`).
- **Execution**: After successful compilation, the binary is executed using another `spawn` call.
- **Streaming**: Data from `public/src.txt` is streamed to the C program's `stdin` using `fs.createReadStream` and `pipe`.

### C Code (`number_formatter.c`)

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    fprintf(stdout,"I am connected! with nodejs application");
    // Open the file for writing
    FILE *outputFile = fopen("public/dest.txt", "w");
    if (outputFile == NULL) {
        perror("Error opening file");
        printf("Check if the directory './public' exists and has write permissions.\n");
        return 1;
    }

    // Read characters from stdin and write to the file
    int c = fgetc(stdin);
    /** If we press ctrl + d it will exit from the while loop */
    while (c != EOF) {
        fprintf(outputFile, "%c", c);
        fflush(outputFile);
        c = fgetc(stdin);
    }

    // Close the file
    fclose(outputFile);
    printf("Data written to ./public/dest.txt successfully.\n");

    exit(0);
}
```

- **File Handling**: The C program opens `public/dest.txt` for writing.
- **Input Processing**: It reads characters from `stdin` and writes them to the output file.
- **Error Handling**: If the file cannot be opened, an error message is printed.

## Conclusion

This project demonstrates how to integrate Node.js with a C program using child processes. It showcases the power of Node.js in managing external processes and handling I/O operations efficiently. This approach can be extended to more complex scenarios, such as real-time data processing or interfacing with legacy systems written in C.

For further exploration, consider:
- Adding error handling for file operations.
- Enhancing the C program to perform more complex data processing.
- Using other Node.js modules like `worker_threads` for parallel processing.

Happy coding! 🚀