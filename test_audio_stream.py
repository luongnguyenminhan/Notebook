#!/usr/bin/env python3
"""
Simple test script to test the audio streaming WebSocket endpoint
"""
import asyncio
import json

import websockets

async def test_audio_stream():
    uri = "ws://localhost:8000/api/ws/audio"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket")
            
            # Create a small test audio chunk (silence)
            test_audio = b'\x00' * 1024  # 1024 bytes of silence
            
            # Send test audio chunk as binary data
            await websocket.send(test_audio)
            print("Sent test audio chunk")
            
            # Wait for response
            response = await websocket.recv()
            print(f"Received response: {response}")
            
            # Send finalize message
            finalize_message = {
                "type": "control",
                "action": "close_session"
            }
            
            await websocket.send(json.dumps(finalize_message))
            print("Sent finalize message")
            
            # Wait for final response
            final_response = await websocket.recv()
            print(f"Final response: {final_response}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_audio_stream())
