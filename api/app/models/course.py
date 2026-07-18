# api/app/models/course.py

from datetime import datetime, timezone

from sqlalchemy.orm import validates

from app.config import (
    CERTIFICATE_TEMPLATE_KEYS,
    COURSE_CATEGORIES,
    COURSE_HOURS,
    COURSE_TYPES,
    STATES,
)
from app.extensions import db


class Course(db.Model):
    __tablename__ = "courses"

    __table_args__ = (
        db.UniqueConstraint("state", "course_number", name="uq_courses_state_course_number"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    certificate_template_key = db.Column(db.String(50), nullable=True)
    course_name = db.Column(db.String(255), nullable=False)
    course_number = db.Column(db.String(50), nullable=False)
    course_type = db.Column(db.String(20), nullable=False)
    sponsored_by = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    hours = db.Column(db.Integer, nullable=False)
    course_category = db.Column(db.String(120), nullable=False)
    signer_name = db.Column(db.String(120), nullable=False)

    owner = db.relationship(
        "User", backref=db.backref("courses", cascade="all, delete-orphan")
    )

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # must not be blank
    @validates("course_name", "course_number", "sponsored_by", "signer_name")
    def validate_required_text(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} is required")
        return value.strip()

    # if set, must be one of CERTIFICATE_TEMPLATE_KEYS
    @validates("certificate_template_key")
    def validate_certificate_template_key(self, key, value):
        if value is not None and value not in CERTIFICATE_TEMPLATE_KEYS:
            raise ValueError(
                f"certificate_template_key must be one of {CERTIFICATE_TEMPLATE_KEYS}"
            )
        return value

    # must be one of COURSE_TYPES
    @validates("course_type")
    def validate_course_type(self, key, value):
        if value not in COURSE_TYPES:
            raise ValueError(f"course_type must be one of {COURSE_TYPES}")
        return value

    # must be one of STATES
    @validates("state")
    def validate_state(self, key, value):
        if value not in STATES:
            raise ValueError(f"state must be one of {STATES}")
        return value

    # must be one of COURSE_CATEGORIES
    @validates("course_category")
    def validate_course_category(self, key, value):
        if value not in COURSE_CATEGORIES:
            raise ValueError(f"course_category must be one of {COURSE_CATEGORIES}")
        return value

    # must be one of COURSE_HOURS
    @validates("hours")
    def validate_hours(self, key, value):
        if value not in COURSE_HOURS:
            raise ValueError(f"hours must be one of {COURSE_HOURS}")
        return value

    def __repr__(self):
        return f"<Course id={self.id} course_number={self.course_number!r}>"
