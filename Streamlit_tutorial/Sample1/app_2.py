# 表示系
import streamlit as st

# テキスト(マークダウンで書けます。)
st.write("# title")

# 注釈
st.caption("注釈")

# 画像
st.image("https://ul.h3z.jp/tbfgZLSX.webp")

# テーブル
import pandas as pd

df = pd.DataFrame(
    {
        "first column": [1, 2, 3, 4],
        "second column": [10, 20, 30, 40],
    }
)
st.write(df)

# チャート
st.line_chart(df)

# その他にもmatplotlib,altair,vega_lite,plotly,bokeh,,graphvizあたりを利用するAPIがあります。
