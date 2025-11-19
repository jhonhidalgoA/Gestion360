from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .event_crud import create_event, get_events, update_event, delete_event, get_events_by_month
from .schemas import EventCreate, EventUpdate, EventResponse
from typing import List

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=List[EventResponse])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_events(db, skip=skip, limit=limit)

@router.get("/month/{year}/{month}", response_model=List[EventResponse])
def read_events_by_month(year: int, month: int, db: Session = Depends(get_db)):
    return get_events_by_month(db, year, month)

@router.post("/", response_model=EventResponse)
def create_new_event(event: EventCreate, db: Session = Depends(get_db)):
    return create_event(db=db, event_data=event.model_dump())

@router.put("/{event_id}", response_model=EventResponse)
def update_existing_event(event_id: int, event: EventUpdate, db: Session = Depends(get_db)):
    db_event = update_event(db=db, event_id=event_id, event_data=event.model_dump())
    if db_event is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return db_event

@router.delete("/{event_id}")
def delete_existing_event(event_id: int, db: Session = Depends(get_db)):
    success = delete_event(db=db, event_id=event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return {"detail": "Evento eliminado"}