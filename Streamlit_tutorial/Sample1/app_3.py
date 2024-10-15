# ユーザー入力系
import streamlit as st
import pandas as pd

# テキスト入力
name = st.text_input("名前")

# 数値入力
age = st.number_input("年齢", step=1)

st.write(f"名前: {name}")
st.write(f"年齢: {age}")

## ボタン
if st.button("Push"):
    st.write("ボタンを押しました")

# プルダウン
select = st.selectbox("好きな果物", options=["りんご", "ばなな", "いちご"])
st.write(select)

# プルダウン(複数選択)
multi_select = st.multiselect("好きな色", options=["赤", "青", "黄"])
st.write(multi_select)

# チェックボックス
check = st.checkbox("OK")
st.write(f"チェック：{check}")

# ラジオボタン
radio = st.radio("選択", ["猫", "犬"])
st.write(f"ラジオ：{radio}")

# ファイルアップロード
uploaded_file = st.file_uploader("Upload", type=["csv"])
if uploaded_file:
    dataframe = pd.read_csv(uploaded_file)
    st.write(dataframe)
