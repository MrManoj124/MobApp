import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

_app = None

def get_firestore():
    global _app
    if not _app:
        cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")
        cred = credentials.Certificate(cred_path)
        _app = firebase_admin.initialize_app(cred)
    return firestore.client()
