#include<stdio.h>
#include<math.h>

int main()
{
    for (int angle = 0 ; angle <=180 ; angle+=10){
    double radians = angle*M_PI/180.0 ;
    printf("Angle : %3d° sin = %.2f  Cos %.2f \n " ,angle, sin(radians), cos(radians));
    
    }
    return 0;
}
    