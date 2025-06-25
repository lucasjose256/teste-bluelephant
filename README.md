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
    git clone <URL_DO_SEU_REPOSITORIO>
    cd websocket_challenge
    ```
    (Substitua `<URL_DO_SEU_REPOSITORIO>` pela URL do seu repositório GitHub/GitLab)

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

5.  **Inicie os Clientes:**
    Abra um ou mais *novos terminais* (mantendo o servidor rodando no primeiro terminal) e execute o cliente em cada um deles:
    ```bash
    python client.py
    ```
    Você verá a mensagem: `Conectado ao servidor WebSocket!`

6.  **Interaja:**
    * No terminal de cada cliente, você pode digitar mensagens e pressionar Enter.
    * As mensagens enviadas por um cliente serão exibidas nos terminais de **todos os outros clientes** conectados, demonstrando o broadcast.
    * Para desconectar um cliente, digite `sair` e pressione Enter.
    * Para encerrar o servidor, pressione `Ctrl+C` no terminal onde o servidor está rodando.

---

## Comentários e Explicações Pertinentes

* **Comunicação Assíncrona:** A escolha de `asyncio` e `websockets` é fundamental para lidar com múltiplas conexões concorrentemente sem bloquear o processo principal. Cada conexão é tratada por uma corrotina (`handler`), permitindo que o servidor gerencie muitos clientes simultaneamente.
* **Broadcast Simples:** A implementação do broadcast é direta. Quando uma mensagem é recebida, ela é iterada sobre o conjunto `CONNECTED_CLIENTS` e enviada para cada cliente individualmente, exceto para o remetente original. `asyncio.gather` é usado para enviar essas mensagens em paralelo.
* **Gerenciamento de Conexões:** O `set()` `CONNECTED_CLIENTS` é uma forma eficiente de adicionar e remover conexões, garantindo unicidade e performando bem em operações de busca e remoção.
* **Tratamento de Exceções:** Foram incluídos blocos `try...except...finally` para lidar com desconexões normais (`ConnectionClosedOK`) e erros (`ConnectionClosedError`), garantindo que as conexões sejam devidamente removidas do pool quando encerradas.
* **Cliente de Console:** Para o desafio, um cliente de console foi suficiente para demonstrar a funcionalidade. Em uma aplicação real, o frontend seria tipicamente uma aplicação web ou desktop mais elaborada, com JavaScript no navegador para lidar com WebSockets.
* **Escalabilidade:** Para um cenário de produção com muitos clientes, seria necessário considerar um mecanismo de broadcast mais robusto (como um Message Broker como Redis ou RabbitMQ), especialmente se os servidores precisarem se comunicar entre si (múltiplas instâncias do servidor). Para este desafio, a solução in-memory é perfeitamente aceitável.