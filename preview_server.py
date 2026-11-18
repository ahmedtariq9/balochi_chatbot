import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/standalone.html"
        print("=" * 65)
        print("  SuleimaniGPT (سلیمانی بلوچی اے آئی) Preview Server")
        print(f"  Serving at: {url}")
        print("  Press Ctrl+C to stop the server.")
        print("=" * 65)
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down preview server. Goodbye!")

if __name__ == '__main__':
    run()
