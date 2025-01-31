#include<stdio.h>
#include<stdlib.h>

int main(){

    char c = fgetc(stdin);
    fprintf(stdout,"%c",c);


    exit(0);
}