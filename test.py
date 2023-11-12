# Importing necessary libraries
import pandas as pd
from sklearn.model_selection import train_test_split
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder

# Load the dataset
dataset = pd.read_csv('dataset.csv')

# Handling categorical variables
categorical_cols = ['Grad', 'CompensatedEnergySource', 'Tip incalzire principal', 'AlternativeEnergySources']
one_hot_encoder = OneHotEncoder(handle_unknown='ignore', sparse=False)
X_categorical = pd.DataFrame(one_hot_encoder.fit_transform(dataset[categorical_cols]))
X_categorical.index = dataset.index

# Dropping original categorical columns and concatenating the one-hot encoded columns
dataset = dataset.drop(categorical_cols, axis=1)
X = pd.concat([dataset[['AverageIncome', 'DateOfBirth']], X_categorical], axis=1)

# Selecting the target variable
y = dataset['Consum volum 11.2022']

# Splitting data into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initializing the XGBoost model with the hyperparameters
xgb_model = xgb.XGBRegressor(subsample=0.6, n_estimators=1000, min_child_weight=10,
                             max_depth=3, learning_rate=0.01, colsample_bytree=0.9,
                             objective='reg:squarederror')

# Training the XGBoost model
xgb_model.fit(X_train, y_train)

# Making predictions and evaluating the model
y_pred = xgb_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = mean_squared_error(y_test, y_pred, squared=False)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse}")
print(f"Root Mean Square Error: {rmse}")
print(f"Mean Absolute Error: {mae}")
print(f"R-squared: {r2}")
