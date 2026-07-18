# api/app/models/attendee.py

import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import validates

from app.extensions import db


class Attendee(db.Model):
    __tablename__ = "attendees"

    # rejects an exact duplicate of the same person/course/date; 
    # corrections are handled by deleting the bad record and importing again
    __table_args__ = (
        db.UniqueConstraint(
            "course_id",
            "student_name",
            "student_license_number",
            "completion_date",
            name="uq_attendees_course_student_completion",
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False, index=True)

    public_id = db.Column(
        db.String(36),
        unique=True,
        nullable=False,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    student_name = db.Column(db.String(120), nullable=False)
    student_license_number = db.Column(db.String(50), nullable=False)
    completion_date = db.Column(db.Date, nullable=False)

    course = db.relationship(
        "Course", backref=db.backref("attendees", cascade="all, delete-orphan")
    )

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # must match the name/number as printed on the real estate license;
    # format isn't verified since license_number may have letter prefixes/suffixes
    @validates("student_name", "student_license_number")
    def validate_required_text(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} is required")
        return value.strip()

    def __repr__(self):
        return f"<Attendee id={self.id} public_id={self.public_id!r}>"
