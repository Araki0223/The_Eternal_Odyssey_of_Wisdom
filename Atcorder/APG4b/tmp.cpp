#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    cin >> N >> M;
    vector<int> A(M), B(M);
    for (int i = 0; i < M; i++) {
        cin >> A.at(i) >> B.at(i);
    }

    vector<vector<char>> result(N, vector<char>(N, '-'));

    for(int i=0; i<M; i++){
        result[A[i] - 1][B[i] - 1] = 'o';
        result[B[i] - 1][A[i] - 1] = 'x';
    }

    for(int i=0; i<N; i++){
        for(int j=0; j<N; j++){
            cout << result[i][j];
            if(j == N-1){
                cout << endl;
            }else{
                cout << ' ';
            }
        }
    }

    return 0;

}
