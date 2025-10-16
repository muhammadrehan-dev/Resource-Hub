#include <stdio.h>

int main() {
    int length = 0;
    char ch;

    printf("Enter a Number: ");
    
    while ((ch = getchar()) != '\n') {
        length++;
    }

    printf("Your message was %d characters long.\n", length);

    return 0;
}
