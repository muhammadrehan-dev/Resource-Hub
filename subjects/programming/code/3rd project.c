#include <stdio.h>

int main() {
    printf("Enter Your name: ");
    char full_name[100];
    scanf("%99[^\n]", full_name); // %99[^\n] to prevent buffer overflow
    printf("Hello %s", full_name);
    return 0;
}