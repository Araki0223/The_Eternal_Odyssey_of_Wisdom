// 2024-12-25
// むずかった

#include <bits/stdc++.h>
using namespace std;

int main(){
    int H, W, X, Y;
    cin >> H >> W >> X >> Y;

    X--;
    Y--;

    vector<vector<char>> field(H, vector<char>(W));
    for(int i=0; i<H; i++){
        for(int j=0; j<W; j++){
            cin >> field[i][j];
        }
    }

    string moves;
    cin >> moves;

    set<pair<int, int>> visited_houses;
    int house_count = 0;

    for(char c : moves){
        int nx = X, ny = Y;

        if(c == 'U') nx--;
        else if(c == 'D') nx++;
        else if(c == 'L') ny--;
        else if(c == 'R') ny++;

        // 移動可能かどうか
        if(field[nx][ny] != '#'){
            X = nx;
            Y = ny;

            if(field[X][Y] == '@'){
                if(visited_houses.count({X, Y}) == 0){
                    house_count++;
                    visited_houses.insert({X, Y});
                }
            }
        }
    }

    cout << (X + 1) << " " << (Y + 1) << " " << house_count << endl;

    return 0;
}