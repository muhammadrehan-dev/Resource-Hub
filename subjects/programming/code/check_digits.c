#include<stdio.h>

int main()
{
    int num,i=0;
    printf("Enter Number !");
    scanf("%d",&num);
    for( ; num!=0;num=num/10)
     i++;
    printf("The number has %d digits",i); 
    return 0;
}