#include <bits/stdc++.h>
using namespace std;

// i ~ N-1 の範囲にNの約数が存在するか
bool has_divisor(int N, int i){
    if(i == N){
        return false;
    }
    if(N % i == 0){
        return true;
    }

    return has_divisor(N, i+1);
}

bool is_prime(int N){
    if(N == 1){
        return false;
    }else if(N == 2){
        return true;
    }else{
        return !has_divisor(N, 2);
    }
}

int main(){
    int input;
    cout << "上限："; cin >> input;

    for(int i=0; i<input; i++){
        cout << i << "は";

        if(is_prime(i)){
            cout << "素数";
        }else{
            cout << "素数ではない";
        }

        cout << "です．" << endl;
    }

    // cout << is_prime(1) << endl;  // 0
    // cout << is_prime(2) << endl;  // 1
    // cout << is_prime(12) << endl; // 0
    // cout << is_prime(13) << endl; // 1
    // cout << is_prime(57) << endl; // 0

    return 0;
}