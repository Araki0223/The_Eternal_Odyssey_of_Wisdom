# レイアウト系
import streamlit as st

# ワイドレイアウト
st.set_page_config(layout="wide")

# 横に並べる
cols = st.columns(2)
with cols[0]:
    st.write("列1")
with cols[1]:
    st.write("列2")

# タブ
tabs = st.tabs(["タブ1", "タブ2"])
with tabs[0]:
    st.write("タブ1")
with tabs[1]:
    st.write("タブ2")

# アコーディオン
with st.expander("開きます"):
    st.write("開きました")

# サイドバー
with st.sidebar:
    st.write("サイドバー内に表示されます")
