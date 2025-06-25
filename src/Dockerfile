# Use uma imagem Python mais estável (por exemplo, 3.9-slim-buster para compatibilidade)
# 'slim-buster' é uma imagem base menor, o que é bom para implantação.
FROM python:3.9-slim-buster

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o pyproject.toml para garantir que as dependências de build sejam resolvidas
# Crie um ambiente virtual e instale Poetry, se necessário, ou confie no pip para lidar com o pyproject.toml
# No entanto, para pip instalar via requirements.txt, o pyproject.toml é lido automaticamente
COPY pyproject.toml /app/

# Instale dependências do sistema necessárias para compilação de pacotes como numpy, scipy, scikit-learn
# 'build-essential' fornece compiladores C/C++, e 'python3-dev' fornece cabeçalhos de desenvolvimento Python
RUN apt-get update && apt-get install -y build-essential python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copie o arquivo de requisitos e instale as dependências
# Isso garante que pip use o pyproject.toml para entender as dependências de build,
# mas ainda instala as dependências da aplicação do requirements.txt
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copie o restante dos arquivos da aplicação
# Certifique-se de que a estrutura de pastas reflita o seu projeto (src/, data/, etc.)
# Se os seus CSVs estão diretamente na raiz, você precisará copiá-los
# Exemplo: COPY . /app/ ou COPY src/ /app/src/ e COPY *.csv /app/
COPY . /app/

# Se o seu arquivo app.py e os CSVs estiverem dentro da pasta 'src/', o caminho deve ser ajustado
# Exemplo: Se 'app.py' está em 'src/app.py'
# WORKDIR /app/src
# ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:$PORT", "app:app"]
# O seu 'app.py' espera estar na raiz do diretório de trabalho do gunicorn

# Exponha a porta na qual a aplicação será executada
EXPOSE $PORT

# Comando para iniciar a aplicação usando Gunicorn
# Ajuste 'app:app' se o seu ficheiro principal Flask não for 'app.py' ou a instância do Flask não for 'app'
# Por exemplo, se o seu ficheiro principal Flask for 'main.py' e a instância do Flask for 'flask_app', use 'main:flask_app'
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "app:app"]
