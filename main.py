# Importing necessary libraries
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import OneHotEncoder
import joblib

# Load the dataset
dataset = pd.read_csv('dataset.csv')

# Handling categorical variables
categorical_cols = ['Grad', 'CompensatedEnergySource', 'Tip_incalzire_principal', 'AlternativeEnergySources']
one_hot_encoder = OneHotEncoder(handle_unknown='ignore', sparse=False)
X_categorical = pd.DataFrame(one_hot_encoder.fit_transform(dataset[categorical_cols]))
X_categorical.index = dataset.index

# Dropping original categorical columns and concatenating the one-hot encoded columns
dataset = dataset.drop(categorical_cols, axis=1)
X = pd.concat([dataset[['AverageIncome', 'DateOfBirth']], X_categorical], axis=1)

# Selecting the target variable
y = dataset['Consum volum 11.2022']

# Initializing the XGBoost model with the hyperparameters
xgb_model = xgb.XGBRegressor(subsample=0.6, n_estimators=1000, min_child_weight=10,
                             max_depth=3, learning_rate=0.01, colsample_bytree=0.9,
                             objective='reg:squarederror')

# Training the XGBoost model on the entire dataset
xgb_model.fit(X, y)

# Saving the model and one-hot encoder for later use
joblib.dump(xgb_model, 'xgb_energy_model.pkl')
joblib.dump(one_hot_encoder, 'one_hot_encoder.pkl')

print("Model and one-hot encoder have been saved.")
