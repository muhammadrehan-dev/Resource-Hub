#include<stdio.h>

int main()
{
    float a,b;
    char opt;
    printf("Enter value of a and b ! ");
    scanf("%f %f",&a,&b);
    printf("Enter +,-,×,÷ : ");
    scanf(" %c",&opt);
    if(opt=='+'){
        printf("The sum is : %.1f",a+b);
    } 
    if(opt=='-')
    printf("The subtraction is %.1f",a-b);
    if(opt=='*')
    printf("The multiplication is %.1f",a*b);
    if(opt=='/'){
        if(b!=0)
        printf("The division is %.2f",a/b);
        else 
        printf("B is zero not allowed ");
    }    
    return 0;
}