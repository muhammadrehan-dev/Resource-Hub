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
        if(cha>= 'A' && cha <='Z' ){
         printf("it's a Capital alphabet.\n");
        }  
        else if(cha>='a'&& cha<='z'){
         printf("it is a small alphabet");
        }
        else if(cha>='0'&& cha<='9'){
         printf("It is a number  ");
        } 
        else
        printf("It is a symbol ");
    }
    
    return 0;
}