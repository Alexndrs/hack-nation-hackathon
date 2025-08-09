from fastapi import FastAPI
from database import init_db
from routes import router

# Initialize DB
init_db()

app = FastAPI(title="Running Coach API", version="1.0.0")

# Register routes
app.include_router(router)
