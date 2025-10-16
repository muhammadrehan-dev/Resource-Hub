#include <stdio.h>

int main() {
    int c;

    printf("Enter a digit: ");
    c = getchar();

    if (c >= '0' && c <= '9') {
        printf("You entered a digit: ");
        putchar(c);
        putchar('\n');  
        printf("Numeric Value = %d\n", c - '0'); 
    } else {
        printf("Not a digit.\n");  
    }

    return 0;
}
