// 概論２
// #include <bits/stdc++.h>
// C++ vector 

// vectorの操作 // ---------------------------------------------
// vectorの定義
#include <vector>
vector<char> array(100, 'x'); // vector<配列名> (要素数，初期値);
array.size(); // サイズを求める

array.push_back(x) // 配列末尾への追加
array.insert( , , ); // 配列名.insert(添字，個数，要素) 添字の直前への追加
array.pop_back(); // 配列末尾からの削除
array.erase(); // 添字要素の追加
array.clear();
array.empty(); // true or false

// listの操作 --------------------------------------------------------------
// listの定義
#include <list>
list<int> lst;                // 空のリスト
list<int> lst(5, 10);         // 要素数5、初期値10のリスト
lst.size();                   // リストのサイズを求める
lst.empty();                  // リストが空かを確認 (true or false)
lst.push_back();            // 末尾に要素を追加
lst.push_front();            // 先頭に要素を追加
lst.insert(it, 20);           // イテレータ`it`の位置に要素を挿入
lst.insert(it, 3, 30);        // イテレータ`it`の位置に30を3つ挿入
lst.pop_back();               // 末尾の要素を削除
lst.pop_front();              // 先頭の要素を削除
lst.erase(it);                // イテレータ`it`が指す要素を削除
lst.erase(it1, it2);          // イテレータ`it1`から`it2`の範囲を削除
lst.clear();                  // 全要素を削除
auto it = lst.begin();        // 先頭を指すイテレータを取得
auto it = lst.end();          // 末尾の次を指すイテレータを取得
lst.front();                  // 先頭の要素を取得
lst.back();                   // 末尾の要素を取得
lst.reverse();                // リストを逆順にする
lst.sort();                   // リストを昇順にソート
lst.unique();                 // 重複要素を削除（隣接する重複のみ）

// mapの定義 -----------------------------------------------------
map<int, string> myMap;

myMap.size();               // 要素数を取得
myMap.empty();              // 空か確認 (true: 空, false: 非空)
myMap[1] = "value";         // 要素の追加・更新
myMap.insert({2, "value2"}); // 要素の挿入
myMap.erase(1);             // キー1の要素を削除
myMap.clear();              // 全要素を削除
myMap.find(2);     

// ソート-----------------------------------------------------------------
#include <algorithm>
sort(array.begin(), array.end());
sort(array.begin()+2, array.begin()+5) // ３番目～６番目未満
sort(array.begin()+2, array.end()-1) // ３番目～最後から２番目

bool precede(string str1, string str2) // str1 > str2 の時，trueを返す
sort(array.begin(), array.end(), precede);

// vector要素の２分探索------------------------------------------------
#include <algorithm>
vector<string> array;
bool result;
result = binary_search(array.begin(), array.end(), "Saga");
result = binary_search(array.begin(), array.end(), "Saga", precede);
if(result) cout << "Sagaを発見しました" << endl;
// ------------------------------------------------------------------

// 比較関数
bool precede(string str1, string str2);
bool precede(string str1, string str2){
    return str1.length() < str2.length();
}

// vector要素のコピー
vector<char> array1(10);
vector<char> array2(10);
copy(array1.begin(), array1.end(), array2.begin());
// vector要素の一括置換
vector<char> array(10);
replace(array.begin(), array.end(), 値，新値);





// キューの操作 //--------------------------------------------------
// キューの定義
#include <queue>
que<char>charQueue;

array.push(x); //キューの末尾へ追加
hoge = array.front(); //キューの先頭を得る
array.pop(); //キューの先頭を削除
array.empty(); //true or false
(int)array.size(); //要素数を返す

// スタックの操作 // --------------------------------------------------
// スタックの定義
#include <stack>
stack<char>charStack;

array.push(x); //スタック先頭へ追加
hoge = array.top(); //先頭を得る
array.pop(); //先頭を削除
array.empty(); // true or false
(int)stack.size();
