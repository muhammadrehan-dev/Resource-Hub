#include<stdio.h>

int main()
{
    printf("Hello world!\n");
    char cha;
    printf("Enter any alphabet  ");
    scanf("%c",&cha);
    switch (cha){
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
        printf("The alphabet is vowel ");
        break;
        default :
        if((cha>= 'A' && cha <='Z' )||(cha>='a'&& cha<='z')){
         printf("it's a consonant.\n");
        }  
        else{
         printf("It is not an Alphabet");
        }
    }
    
    return 0;
}