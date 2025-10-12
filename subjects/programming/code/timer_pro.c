#include<stdio.h>
#include<unistd.h>

int main()
{
    int n;
    printf("Enter Timer in seconds !  ");
    scanf("%d",&n);
    while(n>0){
     printf("Time left :%d seconds\n",n);
     sleep(1);
     n--;
    }
    printf("😂 bitch times over");
    return 0;
}