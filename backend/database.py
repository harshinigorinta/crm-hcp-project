from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crm.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# This is our Interaction table in the database
class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(100))
    hcp_specialty = Column(String(100))
    date = Column(String(50))
    location = Column(String(200))
    product_discussed = Column(String(200))
    notes = Column(Text)
    summary = Column(Text)
    sentiment = Column(String(50))
    follow_up_date = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

# Helper to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()