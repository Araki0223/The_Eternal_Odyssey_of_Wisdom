# -*- coding: utf-8 -*-
"""
Created on Tue Oct 15 18:08:30 2024

@author: kaidu
"""

# import relevant libraries (visualization, dashboard, data manipulation)
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import streamlit as st
from datetime import datetime

#define functions

# load data
@st.cache_data
def load_data():
    df_agg = pd.read_csv('Aggregated_Metrics_By_Video.csv').iloc[1:,:]
    df_agg.columns = ['Video','Video title','Video publish time','Comments added','Shares','Dislikes','Likes',
                      'Subscribers lost','Subscribers gained','RPM(USD)','CPM(USD)','Average % viewed','Average view duration',
                      'Views','Watch time (hours)','Subscribers','Your estimated revenue (USD)','Impressions','Impressions ctr(%)']
    # 'Video publish time' カラムのデータを datetime 型に変換
    df_agg['Video publish time'] = pd.to_datetime(df_agg['Video publish time'], format="%b %d, %Y")
    # 平均視聴率
    df_agg['Average view duration'] = df_agg['Average view duration'].apply(lambda x: datetime.strptime(x,'%H:%M:%S'))
    #　'Average view duration' を秒単位で取得　
    df_agg['Avg_duration_sec'] = df_agg['Average view duration'].apply(lambda x: x.second + x.minute*60 + x.hour*3600)
    # エンゲージメント率
    df_agg['Engagement_ratio'] =  (df_agg['Comments added'] + df_agg['Shares'] +df_agg['Dislikes'] + df_agg['Likes']) /df_agg.Views
    # 視聴回数を獲得した新しいチャンネル登録者数で割った値を計算し，'Views / sub gained' という新しいカラムに格納
    df_agg['Views / sub gained'] = df_agg['Views'] / df_agg['Subscribers gained']
    # 'Video publish time' カラムを基準に，動画を新しい順（降順）で並べ替え
    df_agg.sort_values('Video publish time', ascending = False, inplace = True)   
    # Aggregated_Metrics_By_Country_And_Subscriber_Status.csv' というCSVファイルを読み込み，df_agg_sub というデータフレームに格納
    df_agg_sub = pd.read_csv('Aggregated_Metrics_By_Country_And_Subscriber_Status.csv')
    # 再び 'Aggregated_Metrics_By_Video.csv' というCSVファイルを読み込み，df_comments という別のデータフレームに格納
    df_comments = pd.read_csv('Aggregated_Metrics_By_Video.csv')
    # 'Video_Performance_Over_Time.csv' というCSVファイルを読み込み，df_time というデータフレームに格納
    df_time = pd.read_csv('Video_Performance_Over_Time.csv')
    
    return df_agg, df_agg_sub, df_comments, df_time

# create dataframes from the function
df_agg, df_agg_sub, df_comments, df_time = load_data()

#engineer data
df_agg_diff = df_agg.copy()
metric_date_12mo = df_agg_diff['Video publish time'].max() - pd.DateOffset(months =12)
# 'Video publish time' が metric_date_12mo 以降のデータを抽出し，数値列に対してのみ中央値を計算
median_agg = df_agg_diff[df_agg_diff['Video publish time'] >= metric_date_12mo].select_dtypes(include=[np.number]).median()
# median_agg = df_agg_diff[df_agg_diff['Video publish time'] >= metric_date_12mo].median()

numeric_cols = np.array((df_agg_diff.dtypes == 'float64') | (df_agg_diff.dtypes == 'int64'))
df_agg_diff.iloc[:,numeric_cols] = (df_agg_diff.iloc[:,numeric_cols] - median_agg).div(median_agg)
## What metrics will be relevant?
## Difference from baseline
## Percent change by video

# built dashbord
add_sidebar = st.sidebar.selectbox('Aggregate or Individual Video', ('Aggregate Metrics','Individual Video Analysis'))
 
## Total picture
if add_sidebar == 'Aggregate Metrics':
    df_agg_metrics = df_agg[['Video publish time','Views','Likes','Subscribers','Shares','Comments added','RPM(USD)','Average % viewed',
                             'Avg_duration_sec', 'Engagement_ratio','Views / sub gained']]
    metric_date_6mo = df_agg_metrics['Video publish time'].max() - pd.DateOffset(months =6)
    metric_date_12mo = df_agg_metrics['Video publish time'].max() - pd.DateOffset(months =12)
    metric_medians6mo = df_agg_metrics[df_agg_metrics['Video publish time'] >= metric_date_6mo].median()
    metric_medians12mo = df_agg_metrics[df_agg_metrics['Video publish time'] >= metric_date_12mo].median()
    
if add_sidebar == 'Individual Video Analysis':
    st.write('Ind')
