#include<stdio.h>

int main()
{
    printf("Hello world!");
    int num;
    printf("\n Enter number to check whether even or odd : ");
    scanf("%d",&num);
    if(num%2==0){
        printf("Number is even ");
    }
    else{
        printf("number is odd");
    }
    return 0;
}