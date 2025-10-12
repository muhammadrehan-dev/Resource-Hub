// Online C compiler to run C program online
#include <stdio.h>

int main() {
    char ch;
    printf("Koi Vowel enter kr: ");
    scanf(" %c", &ch);   

    switch (ch) {
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'u':
        case 'A':
        case 'E':
        case 'I':
        case 'O':
        case 'U':
            printf("%c aik vowel hai, good.\n", ch);
            break;

        default:
            if(( ch>= 'a' && ch<='z')||( ch>= 'A' && ch<='Z'))
            printf ("Bhai tujhay Vowel ka nhi pata, Yeh consonant hai");
            else printf("Bhai tunay to hadd par krdi, Taliyannn");
    }

    return 0;
}

