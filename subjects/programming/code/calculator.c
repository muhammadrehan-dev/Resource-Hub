#include<stdio.h>

int main()
{
    printf("Hello world!\n");
    float a,b,sum,div,sub,multi;
    printf("Enter a number\n");
    scanf("%f",&a);
    printf("Enter another Number\n");
    scanf("%f",&b);
    sum=a+b;
    sub=a-b;
    multi=a*b;
    div=a/b;
    printf("Addition : %f\nSubtraction : %f\nMultiplication : %f\nDivision : %f\n",sum,sub,multi,div);
    
    return 0;
}