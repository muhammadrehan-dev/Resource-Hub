// Online C compiler to run C program online
#include <stdio.h>

int main() {
    int marks;
    printf("Apny number daal (out of 10): ");
    scanf("%d", &marks);

    switch (marks) {
        case 10:
            printf("Cheating krta hai, itny kisi ke nhi aaty!");
            break;
        case 9:
            printf("Tum jesay logo ki wajah sy teacher zaleel krta hai");
            break;
        case 8:
            printf("Bhai kam parhai kia kr");
            break;
        case 7:
            printf("Parhai sy kuch nhi hota");
            break;
        case 6:
            printf("Bhai kam parha kr");
            break;
        case 5:
            printf("Bhai kam parha kar 4 wala bhi pass hai");
            break;
        case 4:
            printf("Best hai bhai Pass hogya.");
            break;
        case 3:
            printf("Bas thora sa parh leta to pass hojata");
            break;
        case 2:
            printf("Bhai tu banda hi 2 number hai");
            break;
        case 1:
            printf("Kuch to lia, axha hai");
            break;
        case 0:
            printf("Or dekh Series or Anime");
            break;
        default:
            printf("Bhai insaan ka bacha ban ");
    }

    return 0;
}

