from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # The URL of the React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Configuration
DATABASE_URL = "postgresql+pg8000://postgres:12345678@localhost:5432/postgres"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database Model for Users
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    email_id = Column(String(100), unique=True, nullable=False)

# Create Tables
Base.metadata.create_all(bind=engine)

# Dependency for Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models for User Data
class UserCreate(BaseModel):
    username: str
    password: str
    email_id: EmailStr

class UserResponse(BaseModel):
    username: str
    email_id: EmailStr

class LoginRequest(BaseModel):
    username: str
    password: str
    email_id: EmailStr

# Function to add a user into the database
def add_user_to_database(user_data: UserCreate, db: Session):
    hashed_password = pwd_context.hash(user_data.password)
    user = User(
        username=user_data.username,
        password=hashed_password,
        email_id=user_data.email_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

#Signup Endpoint
@app.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists.")
    
    user = add_user_to_database(user_data, db)
    return UserResponse(username=user.username, email_id=user.email_id)

# Login Endpoint
@app.post("/login")
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    # Check if the user exists
    user = db.query(User).filter(User.username == login_request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Check if the email matches
    if user.email_id != login_request.email_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email id")

    # Verify the password
    if not pwd_context.verify(login_request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    return {"message": "User successfully authenticated"}