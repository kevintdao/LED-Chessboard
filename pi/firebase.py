import pyrebase

config = {
    "apiKey": "AIzaSyCupgmt57tzvco2d-yMpPIrmTzee20fC6o",
    "authDomain": "iot-project-led-chessboard.firebaseapp.com",
    "databaseURL": "https://iot-project-led-chessboard-default-rtdb.firebaseio.com",
    "projectId": "iot-project-led-chessboard",
    "storageBucket": "iot-project-led-chessboard.appspot.com",
    "messagingSenderId": "605922107744",
    "appId": "1:605922107744:web:fbae38a1c93fc233c0fe05"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()
