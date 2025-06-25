import asyncio
import websockets
import logging

logging.basicConfig(level=logging.INFO)

#Conjunto para armazenar as conexões ativas
CONNECTED_CLIENTS = set()

async def handler(websocket):
    """
    Função que lida com cada nova conexão WebSocket.
    """
    logging.info(f"Cliente conectado: {websocket.remote_address}")
    CONNECTED_CLIENTS.add(websocket)
    try:
        #escutar mensagens do cliente
        async for message in websocket:
            logging.info(f"Mensagem recebida de {websocket.remote_address}: {message}")
            # Envia a mensagem para todos os outros clientes conectados
            await broadcast_message(message, websocket) # Passa o websocket do remetente
    except websockets.exceptions.ConnectionClosedOK:
        logging.info(f"Cliente desconectado normalmente: {websocket.remote_address}")
    except websockets.exceptions.ConnectionClosedError as e:
        logging.error(f"Cliente desconectado com erro ({e.code}): {websocket.remote_address}")
    finally:
        if websocket in CONNECTED_CLIENTS: 
            CONNECTED_CLIENTS.remove(websocket)
        logging.info(f"Cliente removido do pool: {websocket.remote_address}. Clientes restantes: {len(CONNECTED_CLIENTS)}")

async def broadcast_message(message: str, sender_websocket):
    """
    Envia uma mensagem para todos os clientes conectados, exceto para o remetente.
    """
    if CONNECTED_CLIENTS:
        #Cria uma lista de tarefas de envio para cada cliente
        send_tasks = [
            asyncio.create_task(client_websocket.send(message))
            for client_websocket in CONNECTED_CLIENTS
            if client_websocket != sender_websocket # Exclui o remetente
        ]
        if send_tasks: 
            done, pending = await asyncio.wait(send_tasks, return_when=asyncio.ALL_COMPLETED)
            for task in done:
                if task.exception():
                    logging.error(f"Erro ao enviar mensagem para um cliente: {task.exception()}")
        else:
            logging.info("Nenhum outro cliente conectado para receber broadcast (ou apenas o remetente está conectado).")
    else:
        logging.info("Nenhum cliente conectado para receber broadcast.")

async def main():
    """
    Função principal que inicia o servidor WebSocket.
    """
    #Inicia o servidor WebSocket na porta 8765
    async with websockets.serve(handler, "localhost", 8765):
        logging.info("Servidor WebSocket iniciado em ws://localhost:8765")
        await asyncio.Future() 

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Servidor encerrado por interrupção do usuário (Ctrl+C).")
    except Exception as e:
        logging.error(f"Ocorreu um erro inesperado no servidor: {e}", exc_info=True)