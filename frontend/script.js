document.addEventListener('DOMContentLoaded', () => {
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const connectionStatus = document.getElementById('connectionStatus');

    const wsUri = "ws://localhost:8765";
    let websocket;

    function setStatus(status, className) {
        connectionStatus.textContent = `Status: ${status}`;
        connectionStatus.className = `status ${className}`;
    }


    function addMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        let prefix = '';
        if (type === 'sent') {
            prefix = 'Enviado: ';
            messageElement.classList.add('self-message');
        } else if (type === 'received') {
            prefix = 'Recebido: ';
            messageElement.classList.add('other-message');
        } else if (type === 'system') { 
            prefix = ''; 
            messageElement.classList.add('system-message');
        }

        messageElement.textContent = prefix + message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; 
    }

    function connectWebSocket() {
        setStatus("Conectando...", "connecting");
        websocket = new WebSocket(wsUri);

        websocket.onopen = () => {
            setStatus("Conectado", "connected");
            addMessage("Você está conectado ao chat!", 'system');
            console.log('Conexão WebSocket aberta.');
            messageInput.focus();
        };

        websocket.onmessage = (event) => {
            addMessage(event.data, 'received');
            console.log('Mensagem recebida:', event.data);
        };

        websocket.onerror = (error) => {
            console.error('Erro no WebSocket:', error);
            setStatus("Erro", "disconnected");
            addMessage("Erro na conexão WebSocket. Verifique o console.", 'system');
        };

        websocket.onclose = (event) => {
            setStatus("Desconectado", "disconnected");
            let reason;
            if (event.wasClean) {
                reason = 'Conexão fechada normalmente.';
            } else {
                reason = 'Conexão interrompida (Ex: Servidor caiu ou rede indisponível).';
            }
            addMessage(`Desconectado: ${reason} (Código: ${event.code}, Razão: ${event.reason || 'N/A'})`, 'system');
            console.log('Conexão WebSocket fechada:', event.code, event.reason);

            if (!event.wasClean) {
                console.log('Tentando reconectar em 3 segundos...');
                setTimeout(connectWebSocket, 3000);
            }
        };
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && websocket.readyState === WebSocket.OPEN) {
            websocket.send(message);
            // Display immediately as 'sent'
            addMessage(message, 'sent');
            messageInput.value = '';
        } else if (websocket.readyState !== WebSocket.OPEN) {
            alert('Não conectado ao servidor. Tente novamente.');
        }
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    connectWebSocket();
});