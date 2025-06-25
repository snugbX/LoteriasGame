from flask import Flask, jsonify, request, send_from_directory
import gerador_loterias # Importa o módulo de geração de loterias
import os
import re # Para expressões regulares
import pandas as pd # Importa pandas para ler CSV

# Inicializa a aplicação Flask.
# O parâmetro static_folder='.' indica que o Flask deve procurar arquivos estáticos
# (como index.html, script.js, style.css) no diretório atual (src).
app = Flask(__name__, static_folder='.')

@app.route('/')
def home():
    """
    Rota principal que serve o arquivo index.html.
    """
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_files(path):
    """
    Rota para servir arquivos estáticos (CSS, JS, imagens, etc.) da pasta 'src'.
    """
    return app.send_static_file(path)


@app.route('/gerar_jogos/<lottery_type>') # Agora aceita o tipo de loteria na URL
def gerar_jogos(lottery_type):
    """
    Rota da API que gera jogos para uma loteria específica e os retorna como JSON.
    Aceita um parâmetro 'num_games' opcional para a quantidade de jogos.
    Além disso, salva os jogos gerados em um arquivo CSV.
    """
    # Valida o tipo de loteria recebido
    if lottery_type not in gerador_loterias.LOTTERY_CONFIGS:
        gerador_loterias.logging.error(f"Requisição para tipo de loteria inválido: {lottery_type}")
        return jsonify({"error": "Tipo de loteria inválido"}), 400 # Bad Request

    # Obtém a quantidade de jogos do parâmetro de consulta, se fornecido
    num_games_str = request.args.get('num_games')
    num_games = None
    if num_games_str:
        try:
            num_games = int(num_games_str)
            if not (1 <= num_games <= 100): # Exemplo de validação: entre 1 e 100
                return jsonify({"error": "Quantidade de jogos inválida. Deve ser entre 1 e 100."}), 400
        except ValueError:
            return jsonify({"error": "Quantidade de jogos inválida. Deve ser um número inteiro."}), 400


    try:
        # 1. Gera os jogos usando a função genérica, passando a quantidade se fornecida
        jogos_gerados = gerador_loterias.generate_n_lottery_games(lottery_type, num_games_to_generate=num_games)

        if not jogos_gerados:
            gerador_loterias.logging.error(f"Nenhum jogo pôde ser gerado para {lottery_type}. Verifique o log do servidor.")
            return jsonify({"error": "Nenhum jogo pôde ser gerado. Verifique o log do servidor."}), 500

        # 2. Salva os jogos gerados em um arquivo CSV
        # Usa o OUTPUT_DIR já corrigido em gerador_loterias
        gerador_loterias.save_generated_games_to_csv(
            jogos_gerados,
            lottery_type,
            gerador_loterias.OUTPUT_DIR
        )

        # 3. Retorna os jogos gerados como uma resposta JSON para o frontend
        return jsonify(jogos_gerados)
    except Exception as e:
        gerador_loterias.logging.error(f"Erro na rota /gerar_jogos/{lottery_type}: {e}")
        return jsonify({"error": "Erro interno ao gerar ou salvar jogos", "details": str(e)}), 500

@app.route('/get_history_files/<lottery_type>')
def get_history_files(lottery_type):
    """
    Retorna uma lista de arquivos CSV de histórico para o tipo de loteria especificado.
    """
    # Define o diretório onde os arquivos de histórico são salvos (raiz do projeto)
    history_dir = gerador_loterias.OUTPUT_DIR
    
    if not os.path.exists(history_dir):
        gerador_loterias.logging.warning(f"Diretório de histórico não encontrado: {history_dir}")
        return jsonify({"files": []}) # Retorna vazio se a pasta não existe

    try:
        files = []
        # Regex para encontrar arquivos que começam com o tipo de loteria e terminam com .csv
        # Ex: megasena_resultados_YYYY-MM-DD_HH-MM-SS.csv
        pattern = re.compile(rf"^{lottery_type}_resultados_.*\.csv$", re.IGNORECASE) # Adicionado IGNORECASE para robustez

        for filename in os.listdir(history_dir):
            if pattern.match(filename):
                files.append(filename)
        
        # Ordena os arquivos do mais novo para o mais antigo (baseado na data/hora no nome)
        files.sort(reverse=True) 
        
        return jsonify({"files": files})
    except Exception as e:
        gerador_loterias.logging.error(f"Erro ao listar arquivos de histórico para {lottery_type}: {e}")
        return jsonify({"error": "Erro ao listar histórico"}), 500

@app.route('/get_file_content/<filename>')
def get_file_content(filename):
    """
    Lê o conteúdo de um arquivo CSV de histórico e o retorna como JSON.
    """
    # Agora usa o OUTPUT_DIR já corrigido em gerador_loterias
    history_dir = gerador_loterias.OUTPUT_DIR
    file_path = os.path.join(history_dir, filename)

    # Proteção: impede acesso a arquivos fora do diretório de histórico
    # É crucial usar os.path.abspath para normalizar os caminhos
    abs_history_dir = os.path.abspath(history_dir)
    abs_file_path = os.path.abspath(file_path)

    # Garante que o arquivo existe, é um arquivo e está dentro do diretório de histórico
    if not os.path.exists(abs_file_path) or not os.path.isfile(abs_file_path) or not abs_file_path.startswith(abs_history_dir):
        gerador_loterias.logging.warning(f"Tentativa de acesso não autorizado ou arquivo não encontrado: {filename} (Caminho absoluto: {abs_file_path})")
        return jsonify({"error": "Arquivo não encontrado ou acesso negado"}), 404

    try:
        # Lê o CSV. O read_csv tentará inferir o cabeçalho.
        df = pd.read_csv(file_path)
        # Converte o DataFrame para uma lista de listas (JSON)
        # .values.tolist() retorna uma lista de listas
        # Converter para int para garantir serialização JSON
        data = df.apply(lambda x: x.astype(int)).values.tolist()
        return jsonify({"content": data})
    except Exception as e:
        gerador_loterias.logging.error(f"Erro ao ler conteúdo do arquivo {filename}: {e}")
        return jsonify({"error": "Erro ao carregar conteúdo do arquivo"}), 500

@app.route('/get_hot_cold_numbers/<lottery_type>')
def get_hot_cold_numbers_api(lottery_type):
    """
    Retorna os números mais e menos frequentes para a loteria especificada.
    """
    if lottery_type not in gerador_loterias.LOTTERY_CONFIGS:
        return jsonify({"error": "Tipo de loteria inválido"}), 400
    
    try:
        hot_cold_data = gerador_loterias.get_hot_cold_numbers(lottery_type)
        return jsonify(hot_cold_data)
    except Exception as e:
        gerador_loterias.logging.error(f"Erro ao obter números quentes/frios para {lottery_type}: {e}")
        return jsonify({"error": "Erro ao obter números quentes e frios"}), 500

@app.route('/clear_history/<lottery_type>', methods=['POST'])
def clear_history(lottery_type):
    """
    Deleta todos os arquivos CSV de histórico para o tipo de loteria especificado.
    """
    history_dir = gerador_loterias.OUTPUT_DIR

    if not os.path.exists(history_dir):
        return jsonify({"message": "Diretório de histórico não encontrado, nada para limpar."}), 200

    try:
        # Regex para encontrar arquivos que começam com o tipo de loteria e terminam com .csv
        pattern = re.compile(rf"^{lottery_type}_resultados_.*\.csv$", re.IGNORECASE)
        deleted_files_count = 0
        
        for filename in os.listdir(history_dir):
            if pattern.match(filename):
                file_path = os.path.join(history_dir, filename)
                os.remove(file_path)
                deleted_files_count += 1
                gerador_loterias.logging.info(f"Arquivo de histórico deletado: {file_path}")
        
        return jsonify({"message": f"{deleted_files_count} arquivos de histórico para {lottery_type} foram deletados."}), 200
    except Exception as e:
        gerador_loterias.logging.error(f"Erro ao limpar histórico para {lottery_type}: {e}")
        return jsonify({"error": "Erro ao limpar histórico"}), 500

@app.route('/delete_file/<filename>', methods=['POST'])
def delete_single_file(filename):
    """
    Deleta um único arquivo CSV de histórico.
    """
    history_dir = gerador_loterias.OUTPUT_DIR
    file_path = os.path.join(history_dir, filename)

    # Proteção: impede acesso a arquivos fora do diretório de histórico
    # e garante que o arquivo pertence ao padrão esperado
    abs_history_dir = os.path.abspath(history_dir)
    abs_file_path = os.path.abspath(file_path)

    # Regex para validar o formato do nome do arquivo antes de apagar
    pattern = re.compile(r"^(megasena|lotofacil|quina)_resultados_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$", re.IGNORECASE)

    if not pattern.match(filename) or not abs_file_path.startswith(abs_history_dir):
        gerador_loterias.logging.warning(f"Tentativa de exclusão de arquivo inválido ou fora do diretório permitido: {filename}")
        return jsonify({"error": "Nome de arquivo inválido ou acesso negado."}), 400

    if not os.path.exists(abs_file_path) or not os.path.isfile(abs_file_path):
        return jsonify({"message": f"Arquivo '{filename}' não encontrado."}), 404

    try:
        os.remove(abs_file_path)
        gerador_loterias.logging.info(f"Arquivo deletado: {abs_file_path}")
        return jsonify({"message": f"Arquivo '{filename}' deletado com sucesso."}), 200
    except Exception as e:
        gerador_loterias.logging.error(f"Erro ao deletar arquivo '{filename}': {e}")
        return jsonify({"error": "Erro ao deletar arquivo."}), 500

if __name__ == '__main__':
    # Certifica-se de que o diretório de saída para os resultados CSV exista.
    os.makedirs(gerador_loterias.OUTPUT_DIR, exist_ok=True)
    app.run(debug=True)
