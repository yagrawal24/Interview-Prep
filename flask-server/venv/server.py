from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import AutoProcessor, BarkModel
import scipy
import os
import numpy as np

app = Flask(__name__, static_folder="audio_files")
# cors = CORS(app, resources={r"/generate_audio": {"origins": "http://localhost:3000"}})

# CORS(app, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "*"}})



# CORS(app)
# os.environ['SUNO_USE_SMALL_MODELS'] = 'True'
# os.environ["SUNO_OFFLOAD_CPU"] = "True"
os.environ["SUNO_USE_SMALL_MODELS"] = "True"
processor = AutoProcessor.from_pretrained("suno/bark")
model = BarkModel.from_pretrained("suno/bark")
AUDIO_FOLDER = "audio_files"
print(os.path.abspath(AUDIO_FOLDER))


@app.route('/generate_audio', methods=['POST'])
# def generate_audio():
#     try:
#         text = request.json['text']
#         voice_preset = "v2/en_speaker_6"
        
#         # Split text into chunks based on word count
#         words = text.split()
#         chunk_size = 15  # You can adjust this value based on the maximum size that works well with the model
#         chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]

#         combined_audio = []

#         for chunk in chunks:
#             inputs = processor(chunk, voice_preset=voice_preset)
#             audio_array_chunk = model.generate(**inputs).cpu().numpy().squeeze()
#             combined_audio.extend(audio_array_chunk.tolist())
        
#         output_filename = os.path.join(AUDIO_FOLDER, f"audio1.wav")
#         sample_rate = model.generation_config.sample_rate
#         scipy.io.wavfile.write(output_filename, rate=sample_rate, data=np.array(combined_audio, dtype=np.int16))
        
#         return jsonify({"audio_file": os.path.basename(output_filename)})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
def generate_audio():
    try:
        text = request.json['text']
        voice_preset = "v2/en_speaker_6"
        inputs = processor(text, voice_preset=voice_preset)
        audio_array = model.generate(**inputs)
        audio_array = audio_array.cpu().numpy().squeeze()
        output_filename = os.path.join(AUDIO_FOLDER, f"audio1.wav")
        sample_rate = model.generation_config.sample_rate
        scipy.io.wavfile.write(output_filename, rate=sample_rate, data=audio_array)
        return jsonify({"audio_file": os.path.basename(output_filename)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/audio1', methods=['GET'])
def serve_audio_file():
    """Serve the audio file to the frontend."""
    return send_from_directory(app.static_folder, "audio1.wav")


@app.route('/test_cors', methods=['GET', 'OPTIONS'])
def test_cors():
    return "CORS test", 200

if __name__ == '__main__':
    # Ensure the audio directory exists
    if not os.path.exists(AUDIO_FOLDER):
        os.makedirs(AUDIO_FOLDER)

    app.run(debug=True, host='0.0.0.0', port=5001)
