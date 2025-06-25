# Desafio Técnico: Comunicação com WebSockets (Python)

Este projeto demonstra uma solução básica para o desafio técnico de comunicação com WebSockets, implementando um servidor e um cliente de console simples utilizando Python e a biblioteca `websockets`.

---

## Funcionalidades

### Backend (Servidor)
* **Endpoint WebSocket:** Expõe um endpoint WebSocket (`ws://localhost:8765`) para conexões de clientes.
* **Pool de Conexões:** Mantém um conjunto (`set`) de todas as conexões WebSocket ativas.
* **Broadcast de Mensagens:** Qualquer mensagem recebida de um cliente é retransmitida (broadcast) para **todos os outros clientes** conectados (excluindo o remetente).
* **Logging:** Logs básicos são exibidos no console para monitoramento.

### Frontend (Cliente)
* **Conexão WebSocket:** Capaz de estabelecer uma conexão WebSocket com o servidor.
* **Envio de Mensagens:** Permite ao usuário digitar mensagens no console e enviá-las para o servidor.
* **Exibição de Mensagens:** Exibe todas as mensagens recebidas do servidor no console.

---

## Tecnologias Utilizadas

* **Python 3.8+**
* **`websockets`**: Biblioteca Python para construir servidores e clientes WebSocket.
* **`asyncio`**: Biblioteca padrão do Python para escrita de código concorrente usando sintaxe `async/await`.

---

## Como Instalar e Executar o Projeto

Siga os passos abaixo para configurar e rodar o projeto.

### Pré-requisitos

* Python 3.8 ou superior instalado em sua máquina.

### Passos de Instalação e Execução

1.  **Clone o Repositório** (ou crie os arquivos manualmente):
    ```bash
    git clone https://github.com/lucasjose256/teste-bluelephant.git
    ```

2.  **Crie e Ative um Ambiente Virtual (Recomendado):**
    ```bash
    python -m venv venv
    # No Windows:
    venv\Scripts\activate
    # No macOS/Linux:
    source venv/bin/activate
    ```

3.  **Instale as Dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Inicie o Servidor:**
    Abra um terminal e execute o servidor:
    ```bash
    python server.py
    ```
    Você verá a mensagem: `Servidor WebSocket iniciado em ws://localhost:8765`

### 5. **Inicie os Clientes**

Abra **outro terminal** (mantendo o servidor rodando no primeiro) e execute os comandos abaixo para iniciar a interface web:

```bash
cd frontend
python -m http.server 8000
```

6.  **Interaja:**  
    * Abra o navegador e acesse o endereço: [http://localhost:8000](http://localhost:8000)  
    * A interface web será carregada.
    * Envie mensagens através da interface, elas serão transmitidas para todos os outros clientes conectados via WebSocket em tempo real.

7.  **Testando com Múltiplos Clientes:**  
    * Abra múltiplas abas no navegador ou use diferentes dispositivos na mesma rede.
    * Todas as mensagens enviadas em qualquer cliente serão transmitidas para os demais.
