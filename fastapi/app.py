from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from database import connect_db, disconnect_db, init_db
from routes.books import router as books_router
from routes.users import router as users_router
from routes.recents import router as recents_router
from routes.favourites import router as favourites_router
from routes.notes import router as notes_router

app = FastAPI()

# For development purposes
origins = ["*"]
# origins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.1.96:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)
app.mount("/images_static", StaticFiles(directory="/images"), name="images")
app.mount("/books_static", StaticFiles(directory="/books"), name="books")

app.include_router(books_router)
app.include_router(users_router)
app.include_router(recents_router)
app.include_router(favourites_router)
app.include_router(notes_router)


@app.on_event("startup")
async def startup():
    await connect_db()
    await init_db()


@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()
