#include <bits/stdc++.h>
using namespace std;

int main() {
  int A, B, C;
  cin >> A >> B >> C;

  int max_height = max({A, B, C});

  int min_height = min({A, B, C});

  cout << abs(max_height - min_height) << endl;

  return 0;
}