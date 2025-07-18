from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/test")
async def test_websocket(websocket: WebSocket):
    """Simple test WebSocket endpoint"""
    await websocket.accept()
    logger.info("WebSocket test connection accepted")

    try:
        while True:
            # Receive message from client
            message = await websocket.receive()
            logger.info(f"Test WebSocket received: {message}")

            # Handle binary data
            if "bytes" in message:
                binary_data = message["bytes"]
                await websocket.send_text(f"Echo binary: {len(binary_data)} bytes")
            # Handle text data
            elif "text" in message:
                text_data = message["text"]
                await websocket.send_text(f"Echo text: {text_data}")
            else:
                await websocket.send_text(f"Echo message: {message}")

    except WebSocketDisconnect:
        logger.info("Test WebSocket disconnected")
    except Exception as e:
        logger.error(f"Error in test WebSocket: {e}")
