from flask import Flask, request, jsonify , send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import torch
from transformers import pipeline 
import jwt
import datetime
import json
import scipy.io.wavfile
#-----------------------Model------------------------------

MODEL_NAME = "biodatlab/whisper-th-small-combined"
lang = "th"

cuda_available = torch.cuda.is_available()
device = torch.device("cuda" if cuda_available else "cpu")

pipe_spech_to_text = pipeline(
    task="automatic-speech-recognition",
    model=MODEL_NAME,
    chunk_length_s=30,
    device=device if cuda_available else -1,  
)

text_to_speech_pipeline = pipeline("text-to-speech", model="facebook/mms-tts-tha")

def SpeechReconization(filename):
    text = pipe_spech_to_text(filename, generate_kwargs={"language":"<|th|>", "task":"transcribe"}, batch_size=16)["text"]
    return text

def SpeechSynthesis(q_id , text):
    output = text_to_speech_pipeline(text)

    audio_data = output['audio']
    sampling_rate = output['sampling_rate']

    if audio_data.ndim == 2 and audio_data.shape[0] == 1:
        audio_data = audio_data[0]
    
    if not os.path.exists("question_voice"):
        os.makedirs("question_voice")

    file_name = f"q_{q_id}_speech.wav"
    file_path = os.path.join("question_voice", file_name)

    scipy.io.wavfile.write(file_path, sampling_rate, audio_data)
    
    return file_name

def update_chID():
    with app.app_context():
        latest_check_in = SelfCheckIn.query.order_by(SelfCheckIn.date.desc()).first()

    if latest_check_in:
        current_id = latest_check_in.ch_id
        # สมมติว่ารูปแบบคือ 'ch' ตามด้วยตัวเลข
        prefix, num = current_id[:2], current_id[2:]
        new_id = prefix + str(int(num) + 1)
        # print(f"New ch_id will be: {new_id}")
    else:
        new_id = 'ch1'

        
    return new_id
#--------------------------------Model------------------------------

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ICE_MENTOS'
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.environ['MYSQL_USER']}:{os.environ['MYSQL_PASSWORD']}@db/{os.environ['MYSQL_DATABASE']}"
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/smart_clinic'
app.config['SQLALCHEMY_POOL_SIZE'] = 10
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 0
app.config['SQLALCHEMY_POOL_TIMEOUT'] = None  # Adjust this as needed
db = SQLAlchemy(app)
CORS(app)

encoded = jwt.encode({'some': 'payload'}, 'secret', algorithm='HS256') #ใช้ตอน login

#----------------------Account-----------------------------------------
class Account(db.Model):
    __tablename__ = 'account'
    account_id = db.Column('account_id', db.String, primary_key=True)
    password = db.Column('password', db.String, nullable=False)
    name = db.Column('name', db.String)
    birthDate = db.Column('birthDate', db.Date)
    phoneNumber = db.Column('phoneNumber', db.String)
    gender = db.Column('gender', db.String(1))
    address = db.Column('address', db.String)
    role_id = db.Column('role_id', db.String)
#----------------------Account-----------------------------------------
    
#----------------------Question-----------------------------------------
class Q_A(db.Model):
    __tablename__ = 'question_answer'
    q_id = db.Column('q_id', db.String,primary_key = True)
    question = db.Column('question', db.String)
    answer = db.Column('answer',db.String)
    file_name = db.Column('file_name',db.String)
#----------------------Question-----------------------------------------
#----------------------Self Checkin -------------------------------------

class SelfCheckIn(db.Model):
    __tablename__ = 'self_check-in'  # ชื่อตารางในฐานข้อมูล
    ch_id = db.Column(db.String(5), primary_key=True)
    account_id = db.Column(db.Integer, nullable=False)
    pressure = db.Column(db.Text, nullable=False, comment='มาจาก JSON SERVER')
    kiosk_speech = db.Column(db.Text, nullable=False, comment='รูปแบบ JSON')
    date = db.Column(db.DateTime(6), nullable=False)
    weight_check_in = db.Column(db.Float)
    height_check_in = db.Column(db.Float)

    # def __repr__(self):
    #     return f"<SelfCheckIn ch_id={self.ch_id}, date={self.date}>"
#----------------------Self Checkin -----------------------------------------
#----------------------Info Patient -----------------------------------------
class Information_patient(db.Model):
    p_id = db.Column(db.String(13),primary_key=True)
    account_id = db.Column(db.Integer, nullable=False)
    occupation = db.Column(db.String)
    allergy = db.Column(db.String)
    congenital_disease = db.Column(db.String)
#----------------------Info Patient -----------------------------------------
    


#-----------------------Login--------------------------------------------
@app.route('/login', methods=['POST'])
def login():
    auth = request.json

    if not auth or not auth.get('account_id') or not auth.get('password'):
        return jsonify({'message': 'Could not verify', 'WWW-Authenticate': 'Basic auth="Login required"'}), 401

    user = Account.query.filter_by(account_id=auth.get('account_id')).first()

    if not user:
        return jsonify({'message': 'User not found.'}), 404

    # Assuming user.password is an integer in your database
    try:
        # Attempt to convert the provided password to an integer for comparison
        submitted_password = int(auth.get('password'))
    except ValueError:
        # If conversion fails, return an error
        return jsonify({'message': 'Invalid password format.'}), 400

    if user.password == submitted_password:
        # No need to decode since jwt.encode() returns a string in PyJWT 2.0.0+
        token = jwt.encode({'account_id': user.account_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)}, app.config['SECRET_KEY'])
        return jsonify({'token': token,
                        'account_id':user.account_id,
                        'role_id':user.role_id})

    return jsonify({'message': 'Password is wrong.'}), 401
#------------------------------------Login--------------------------------------------

#--------------------------------Get Account ---------------------------------------------
@app.route('/getAcc' , methods=['GET'])
def getAcc():
    try:
        patient = Information_patient.query.all()
        res = [
            {"account_id": pa.account_id,
            "p_id": pa.p_id}
            for pa in patient
        ]
        return jsonify({'result' : res})  
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#--------------------------------Get Account ---------------------------------------------
@app.route('/testAPI' , methods=['GET'])
def testAPI():
    return jsonify({'result' : 'your API is Work'})  


#-------------------------------------Question---------------------------------------------
@app.route('/getQ_A', methods=['GET'])
def getQ_A():
    try:
        q_a = Q_A.query.all()
        result = [
                {"q_id": qa.q_id, "question": qa.question, "answer": qa.answer , "file_name": qa.file_name}
                for qa in q_a
        ]

        return jsonify({'result' : result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#-------------------------------------Question---------------------------------------------


#-----------------------Speech_Rocognization--------------------------------------------
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files: #เช็คว่ามี key ชื่อ file มั้ย
        return jsonify({'error': 'No file part'}), 400
    # print(request)
    file = request.files['file']
    # print("file here")
    # print(file)
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        # ที่นี่คุณสามารถเซฟไฟล์ไปยัง server หรือทำการประมวลผลไฟล์เลย
        filename = os.path.join('uploads', file.filename) #ได้ filename = uploads/audio.wav
        file.save(filename)
        output = SpeechReconization(filename)
        

        return jsonify({'message': 'File uploaded successfully',
                         'filename': file.filename,
                         'output': output})
#-----------------------Speech_Rocognization--------------------------------------------
    
#-----------------------Speech_Synthesis--------------------------------------------
@app.route('/synthesis', methods=['POST'])
def synthesis():
    q_id = request.json.get('q_row')
    question = request.json.get('question')

    print(q_id)
    
    file_name = SpeechSynthesis(q_id,question)
    print(file_name)

    qa = Q_A.query.filter_by(q_id=q_id).first()

    if qa:
        qa.file_name = file_name
        db.session.commit()
        return jsonify({'message': 'Successfully updated filename', 'file_name': file_name})
    else:
        return jsonify({'error': 'Q_A not found'}), 404
#-----------------------Speech_Synthesis--------------------------------------------
    
#-----------------------get_Qvoice--------------------------------------------
AUDIO_FOLDER = os.path.join(os.getcwd(), 'question_voice')

@app.route('/question_voice/<filename>')  #สร้าง Route เพื่อให้สามารถส่งกลับไฟล์เสียงไปเล่นบน React ได้
def serve_audio_file(filename):
    return send_from_directory(AUDIO_FOLDER, filename)



@app.route('/get_qvoice',methods=['POST'])
def get_qvoice():
    fname = request.json.get('filename')
    # print(fname)
    audio_path = f'http://192.168.15.227:5558/question_voice/{fname}' #URL เพื่อให้เข้าถึงไฟล์เสียงได้
    return jsonify({'audioPath': audio_path})    
#-----------------------get_Qvoice--------------------------------------------



    
#-----------------------Map Data // Self Checkin----------------------------------------
@app.route('/mapSelfCheckin',methods=['POST'])
def map_self_checkin():
    data = request.json
    pressure_data = data.get('pressureData')
    kiosk_speech_data = data.get('answers')
    acc_id = int(data.get('account_id'))
    weight = float(data.get('weight'))
    height = float(data.get('height'))

    # print("no error")

    pressure_json = json.dumps(pressure_data , ensure_ascii=False) #ต้อง dump ให้เป็นข้อมูลที่อ่านรุ้เรื่อง
    kiosk_speech_json = json.dumps(kiosk_speech_data , ensure_ascii=False)

    new_checkin = SelfCheckIn(
        ch_id = update_chID(),
        account_id = acc_id,
        pressure = pressure_json,
        weight_check_in = weight,
        height_check_in = height,
        kiosk_speech = kiosk_speech_json,
        date = datetime.datetime.now()
    )

    # print("pass")

    db.session.add(new_checkin)
    db.session.commit()

    return jsonify({"message": "Self check-in recorded successfully."}), 201

#-----------------------Map Data // Self Checkin----------------------------------------


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5558)
