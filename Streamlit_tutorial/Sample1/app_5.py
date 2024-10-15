# 処理系
import streamlit as st

# 状態管理
st.session_state.name = "aaa"  # 再処理が行われてもクリアされない

# 再処理
st.rerun()

# 処理停止
st.stop()
