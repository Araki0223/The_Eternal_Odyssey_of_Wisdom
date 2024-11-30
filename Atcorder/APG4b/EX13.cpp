#include <bits/stdc++.h>
using namespace std;

int main() {
  int N;
  cin >> N;

  vector<int> score(N);

  for(int i=0; i<N; i++){
    cin >> score[i];
  }

  int sum = accumulate(score.begin(), score.end(), 0);

  int avg = sum / N;

  for(int i=0; i<N; i++){
    cout << abs(score[i] - avg) << endl;
  }

  return 0;
}