from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware



model = joblib.load('xgb_energy_model.pkl')
encoder = joblib.load('one_hot_encoder.pkl')

class EnergyData(BaseModel):
    AverageIncome: float
    Grad: str
    CompensatedEnergySource: str
    Tip_incalzire_principal: str
    DateOfBirth: float
    AlternativeEnergySources: str


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.post("/predict")
async def predict(data: EnergyData):
    try:
        # Convert input data into a dataframe
        input_data = pd.DataFrame([data.dict()])
        
        # Handling categorical variables
        encoded_data = encoder.transform(input_data[['Grad', 'CompensatedEnergySource', 'Tip_incalzire_principal', 'AlternativeEnergySources']])
        input_data = input_data.drop(['Grad', 'CompensatedEnergySource', 'Tip_incalzire_principal', 'AlternativeEnergySources'], axis=1)
        input_data = pd.concat([input_data, pd.DataFrame(encoded_data)], axis=1)

        # Make prediction
        prediction = model.predict(input_data)

        # Convert numpy.float32 to native Python float
        prediction_value = prediction[0].item()  # Converts numpy.float32 to native float

        return {"predicted_consumption": prediction_value}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
