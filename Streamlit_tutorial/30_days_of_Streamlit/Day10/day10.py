import streamlit as st

st.header('st.selectbox')

option = st.selectbox(
    'What is your favorite coler?',
    ('Blue', 'Red', 'Green')
)

st.write('Your favorite coloer is ', option)