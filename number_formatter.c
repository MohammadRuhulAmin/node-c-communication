#include <stdio.h>
#include <stdlib.h>

int main() {
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

    return 0;
}

/** End of File
        EOF = '\0'
*/

/*
// To print from stdin
while(c!='\0'){
        fprintf(stdout,"%c",(char)c);
        c = fgetc(stdin);
}

 */