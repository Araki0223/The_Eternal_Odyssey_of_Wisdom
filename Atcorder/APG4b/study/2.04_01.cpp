#include <bits/stdc++.h>
using namespace std;

// 配列の先頭100要素の値の合計を計算する
int sum100(vector<int> a) {
  int result = 0;
  for (int i = 0; i < 100; i++) {
    result += a.at(i);
  }
  return result;
}

int main() {
  vector<int> vec(10000000, 1);  // すべての要素が1の配列

  // sum100 を500回呼び出す
  for (int i = 0; i < 500; i++) {
    cout << sum100(vec) << endl;  // 配列のコピーが生じる
  }
}
