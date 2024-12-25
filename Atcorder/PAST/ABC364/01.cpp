#include <bits/stdc++.h>
using namespace std;

int main(){
    int N;
    char c1, c2;
    string S;

    cin >> N >> c1 >> c2;
    cin >> S;

    for(char &z : S){
        if(z != c1){
            z = c2;
        }
    }

    cout << S << endl;

    return 0;
}