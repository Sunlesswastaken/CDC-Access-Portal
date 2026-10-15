"""Run Attendance Studio in the default browser on this computer."""
import threading
import os
import webbrowser
import uvicorn

if __name__ == '__main__':
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', '8877'))
    if os.getenv('OPEN_BROWSER', '1') == '1':
        threading.Timer(2, lambda: webbrowser.open(f'http://127.0.0.1:{port}/')).start()
    uvicorn.run('backend.main:app', host=host, port=port)
