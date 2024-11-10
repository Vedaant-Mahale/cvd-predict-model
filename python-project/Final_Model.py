import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from sklearn.preprocessing import MaxAbsScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.decomposition import PCA
from sklearn.metrics import r2_score
from sklearn.metrics import classification_report, confusion_matrix
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import f1_score, accuracy_score, precision_score, recall_score, confusion_matrix
from sklearn.model_selection import train_test_split



df=pd.read_csv("heart_data.csv")
df.head(5)
#Converting age in days to age in yrs
df['age'] = np.floor(df['age'] / 365.25).astype(int)
#Creating BMI column using existing weight(Kg) and height(cm) column
df['BMI'] = df['weight'] / ((df['height']/100) ** 2)

#sorting the df acc to age
df.sort_values(by='age', ascending=True, inplace=True)

#interpolate the negative ap_lo and ap_high with previous person who has similar age
df['ap_lo'] = df['ap_lo'].mask(df['ap_lo'] < 0, other=pd.NA)
df['ap_hi'] = df['ap_hi'].mask(df['ap_hi'] < 0, other=pd.NA)

df['ap_lo'] = df.groupby('age')['ap_lo'].transform(lambda x: x.interpolate(method='nearest'))
df['ap_hi'] = df.groupby('age')['ap_hi'].transform(lambda x: x.interpolate(method='nearest'))

column=['weight','ap_lo','ap_hi']
zscore_df=df
#Filter Out Outliers, keeping only the rows where values in the column are within the high and low bounds (i.e., not outliers).
# The resulting dataset, new_df, has outliers removed for the selected columns.
for cols in column:
    # Finding the boundary values
    high=zscore_df[cols].mean() + 3*zscore_df[cols].std();
    low=zscore_df[cols].mean() - 3*zscore_df[cols].std()
    # Triming the outliers
    zscore_df = zscore_df[(zscore_df[cols] < high) & (zscore_df[cols] > low)]
print(zscore_df.head(5))

# Creating two separate train-test splits for two versions of the dataset:
# Original Dataset (df):Splits df into X_train, X_test, y_train, and y_test, where X contains features (everything except the cardio column) and y is the target variable (cardio column).
# Outlier-Removed Dataset (zscore_df):Splits new_df into X_train_scaled, X_test_scaled, y_train_scaled, and y_test_scaled, following the same format as the original dataset split.
X_train, X_test, y_train, y_test = train_test_split(df.drop('cardio', axis=1),
                                                    df['cardio'],
                                                    test_size=0.2,
                                                    random_state=42)
X_train_no_outlier , X_test_no_outlier,y_train_no_outlier,y_test_no_outlier =train_test_split(zscore_df.drop('cardio', axis=1),
                                                    zscore_df['cardio'],
                                                    test_size=0.2,
                                                    random_state=42)
lr = LogisticRegression()
lr_no_outlier = LogisticRegression()
# Fit the models
lr.fit(X_train, y_train)
lr_no_outlier.fit(X_train_no_outlier, y_train_no_outlier)

# Make predictions
y_pred = lr.predict(X_test)
y_pred_no_outlier = lr_no_outlier.predict(X_test_no_outlier)

X_train, X_test, y_train, y_test = train_test_split(
    zscore_df.drop(columns=['cardio', 'index', 'id'], axis=1),
    zscore_df['cardio'],
    test_size=0.2,
    random_state=42
)

# Standardize the feature sets
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Define the model
model = Sequential([
    Dense(16, activation='relu', input_shape=(X_train_scaled.shape[1],)),  # Input layer
    Dense(16, activation='relu'),  # Hidden layer
    Dense(16, activation='relu'),  # Hidden layer
    Dense(1, activation='sigmoid')  # Output layer for binary classification
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
history = model.fit(X_train_scaled, y_train, epochs=10, batch_size=16, validation_split=0.2)




     