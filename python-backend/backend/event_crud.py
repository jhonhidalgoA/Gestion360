from sqlalchemy.orm import Session
from datetime import date
from .models import Event

def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Event).offset(skip).limit(limit).all()

def get_events_by_month(db: Session, year: int, month: int):
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)
    return db.query(Event).filter(
        Event.start_date < end_date,
        Event.end_date >= start_date
    ).all()

def create_event(db: Session, event_data: dict):
    db_event = Event(**event_data)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: int, event_data: dict):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event:
        for key, value in event_data.items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False