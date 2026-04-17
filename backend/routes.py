from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Interaction
from agent import agent
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# ─────────────────────────────────────────
# Request Models
# ─────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str

class FormRequest(BaseModel):
    hcp_name: str
    hcp_specialty: str
    date: str
    location: str
    product_discussed: str
    notes: str

class EditRequest(BaseModel):
    message: str

class HCPInfoRequest(BaseModel):
    hcp_name: str

class FollowUpRequest(BaseModel):
    message: str

# ─────────────────────────────────────────
# ROUTE 1: Log via Chat (AI extracts info)
# ─────────────────────────────────────────
@router.post("/api/log-chat")
def log_via_chat(request: ChatRequest, db: Session = Depends(get_db)):
    state = agent.invoke({
        "action": "log",
        "input_text": request.message,
        "hcp_name": None,
        "hcp_specialty": None,
        "date": None,
        "location": None,
        "product_discussed": None,
        "notes": None,
        "summary": None,
        "sentiment": None,
        "follow_up_date": None,
        "interaction_id": None,
        "result": None
    })

    interaction = Interaction(
        hcp_name=state.get("hcp_name", "Unknown"),
        hcp_specialty=state.get("hcp_specialty", "Unknown"),
        date=state.get("date", "Unknown"),
        location=state.get("location", "Unknown"),
        product_discussed=state.get("product_discussed", "Unknown"),
        notes=state.get("notes", ""),
        summary=state.get("summary", ""),
        sentiment=state.get("sentiment", "neutral"),
        follow_up_date=state.get("follow_up_date", ""),
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return {"message": "Interaction logged!", "id": interaction.id, "data": state}

# ─────────────────────────────────────────
# ROUTE 2: Log via Form
# ─────────────────────────────────────────
@router.post("/api/log-form")
def log_via_form(request: FormRequest, db: Session = Depends(get_db)):
    # Use AI to summarize and detect sentiment
    state = agent.invoke({
        "action": "summarize",
        "input_text": request.notes,
        "hcp_name": None,
        "hcp_specialty": None,
        "date": None,
        "location": None,
        "product_discussed": None,
        "notes": None,
        "summary": None,
        "sentiment": None,
        "follow_up_date": None,
        "interaction_id": None,
        "result": None
    })

    interaction = Interaction(
        hcp_name=request.hcp_name,
        hcp_specialty=request.hcp_specialty,
        date=request.date,
        location=request.location,
        product_discussed=request.product_discussed,
        notes=request.notes,
        summary=state.get("summary", ""),
        sentiment="neutral",
        follow_up_date="",
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return {"message": "Interaction logged via form!", "id": interaction.id}

# ─────────────────────────────────────────
# ROUTE 3: Edit Interaction
# ─────────────────────────────────────────
@router.put("/api/edit-interaction/{interaction_id}")
def edit_interaction(interaction_id: int, request: EditRequest, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")

    state = agent.invoke({
        "action": "edit",
        "input_text": request.message,
        "hcp_name": interaction.hcp_name,
        "hcp_specialty": interaction.hcp_specialty,
        "date": interaction.date,
        "location": interaction.location,
        "product_discussed": interaction.product_discussed,
        "notes": interaction.notes,
        "summary": interaction.summary,
        "sentiment": interaction.sentiment,
        "follow_up_date": interaction.follow_up_date,
        "interaction_id": interaction_id,
        "result": None
    })

    interaction.hcp_name = state.get("hcp_name", interaction.hcp_name)
    interaction.hcp_specialty = state.get("hcp_specialty", interaction.hcp_specialty)
    interaction.date = state.get("date", interaction.date)
    interaction.location = state.get("location", interaction.location)
    interaction.product_discussed = state.get("product_discussed", interaction.product_discussed)
    interaction.notes = state.get("notes", interaction.notes)
    interaction.sentiment = state.get("sentiment", interaction.sentiment)
    interaction.follow_up_date = state.get("follow_up_date", interaction.follow_up_date)

    db.commit()
    return {"message": "Interaction updated!", "data": state}

# ─────────────────────────────────────────
# ROUTE 4: Get HCP Info
# ─────────────────────────────────────────
@router.post("/api/hcp-info")
def get_hcp_info(request: HCPInfoRequest):
    state = agent.invoke({
        "action": "get_hcp_info",
        "input_text": request.hcp_name,
        "hcp_name": None,
        "hcp_specialty": None,
        "date": None,
        "location": None,
        "product_discussed": None,
        "notes": None,
        "summary": None,
        "sentiment": None,
        "follow_up_date": None,
        "interaction_id": None,
        "result": None
    })
    return {"result": state.get("result", "")}

# ─────────────────────────────────────────
# ROUTE 5: Schedule Follow-up
# ─────────────────────────────────────────
@router.post("/api/schedule-followup")
def schedule_followup(request: FollowUpRequest):
    state = agent.invoke({
        "action": "schedule_followup",
        "input_text": request.message,
        "hcp_name": None,
        "hcp_specialty": None,
        "date": None,
        "location": None,
        "product_discussed": None,
        "notes": None,
        "summary": None,
        "sentiment": None,
        "follow_up_date": None,
        "interaction_id": None,
        "result": None
    })
    return {"result": state.get("result", "")}

# ─────────────────────────────────────────
# ROUTE 6: Get All Interactions
# ─────────────────────────────────────────
@router.get("/api/interactions")
def get_interactions(db: Session = Depends(get_db)):
    interactions = db.query(Interaction).all()
    return interactions

# ─────────────────────────────────────────
# ROUTE 7: Get Single Interaction
# ─────────────────────────────────────────
@router.get("/api/interactions/{interaction_id}")
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction