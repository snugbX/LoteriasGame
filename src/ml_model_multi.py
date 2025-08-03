
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from gerador_loterias import LOTTERY_CONFIGS

def train_model(file_path, columns_prefix, max_number, model_path):
    df = pd.read_csv(file_path, skiprows=6)

    number_cols = [col for col in df.columns if col.startswith(columns_prefix)]
    df_numbers = df[number_cols].fillna(0).astype(int)

    data = []
    targets = []

    for _, row in df_numbers.iterrows():
        bin_vector = [1 if i in row.values else 0 for i in range(1, max_number+1)]
        data.append(bin_vector)
        targets.append(bin_vector)

    model = RandomForestClassifier(n_estimators=100)
    model.fit(data, targets)

    joblib.dump(model, model_path)
    print(f"Modelo treinado e salvo em: {model_path}")

if __name__ == '__main__':
    for lottery_type, config in LOTTERY_CONFIGS.items():
        model_filename = f"{lottery_type}_model.pkl"
        train_model(
            config['FILE_PATH'],
            config['CSV_COLUMNS_PREFIX'],
            config['MAX_NUMBER'],
            model_filename
        )
