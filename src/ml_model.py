
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_model(file_path, columns_prefix, max_number):
    df = pd.read_csv(file_path, skiprows=6)

    # Extrai colunas com os números sorteados
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

    joblib.dump(model, 'lottery_model.pkl')
    print("Modelo treinado e salvo como lottery_model.pkl")

if __name__ == '__main__':
    from gerador_loterias import LOTTERY_CONFIGS
    config = LOTTERY_CONFIGS['megasena']  # ou 'lotofacil', 'quina'
    train_model(config['FILE_PATH'], config['CSV_COLUMNS_PREFIX'], config['MAX_NUMBER'])
