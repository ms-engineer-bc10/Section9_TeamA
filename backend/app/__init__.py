import os
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
firebase_admin.initialize_app(cred, {
    'projectId': os.environ['FIREBASE_PROJECT_ID'],
})