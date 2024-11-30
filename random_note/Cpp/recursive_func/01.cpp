// url : https://www.momoyama-usagi.com/entry/info-algo-saiki
#include <bits/stdc++.h>
using namespace std;

int kappa_salary(n){
    if(n == 1){
        return 10;
    }else{
        return 2 * kappa_salary(n-1) - 5;
    }
}

double sinexp(n){
    if(n == 0){
        return M_PI / 2;
    }else if(n == 1){
        return 1;
    }else{
        // return ((n - 1) / n) * sinexp(n - 2); // 整数乗算のため切り捨てられる可能性がある
        return (n-1) * 1.0 / n * sinexp(n-2);
    }
}