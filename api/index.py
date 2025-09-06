from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import PyPDF2
from dotenv import load_dotenv
load_dotenv()

from .ai_models import model


app = Flask(__name__, static_folder='public')
CORS(app)


def extract_pdf_text(file):
    reader = PyPDF2.PdfReader(file)

    page_numbers = len(reader.pages)
    print(f"O PDF tem {page_numbers} páginas.\n")

    text = ""

    for i, page in enumerate(reader.pages):
        text += page.extract_text()

    return text


# Allowed file extensions for the /upload route
ALLOWED_EXTENSIONS = {'txt', 'pdf'}

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/hello')
@app.route('/api/hello')
def world():
    return "oi"


@app.route('/')
def index():
    print('Entrou no /')
    return render_template('index.html')


# Route for uploading a .txt or .pdf file (in-memory)
@app.route('/upload', methods=['POST'])
@app.route('/api/upload', methods=['POST'])
def upload_file():
    print('Entrou no /upload')
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only .txt and .pdf files are allowed.'}), 400


    def is_pdf(file_content):
    # Check for PDF file signature "%PDF-" (ASCII)
        return file_content[:5] == b'%PDF-'

    file_content = file.read()


    # If file is a PDF, check the content signature
    if file.filename.lower().endswith('.pdf'): # type: ignore
        if not is_pdf(file_content):
            return jsonify({'error': 'Uploaded file is not a valid PDF.'}), 400

        file_content = extract_pdf_text(file)
    else:
        file_content = file_content.decode("utf-8")

    # print(file_content)
    res = model.ask(file_content)
    print("response da IA: ", res)
    if "```json" in res: # type: ignore
        res = res.split("```json")[1].split("```")[0].strip() # type: ignore

    res_json = json.loads(res) # type: ignore


    if isinstance(res_json, list):
        new_json = { "emails": res_json }
        res_json = new_json

    print(res_json)

    return jsonify(res_json)


# Route for receiving text and an optional file (any type, in-memory)
@app.route('/reply', methods=['POST'])
@app.route('/api/reply', methods=['POST'])
def reply():
    text = request.form.get('text')

    if not text:
        return jsonify({'error': 'Text is required'}), 400

    file = request.files.get('file')
    file_message = 'No file uploaded.'

    if file:
        file_content = file.read()
        file_size = len(file_content)
        file_preview = file_content[:100]

        file_message = {
            'file_name': file.filename,
            'file_size': file_size,
            'file_preview': file_preview.decode('utf-8', errors='ignore')
        }

    return jsonify({
        'message': 'Reply received.',
        'text': text,
        'file_message': file_message
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
