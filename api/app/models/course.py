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


# field name -> its allowed-values source of truth, shared by one validator below
_ENUM_FIELDS = {
    "course_type": COURSE_TYPES,
    "state": STATES,
    "course_category": COURSE_CATEGORIES,
    "hours": COURSE_HOURS,
}


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

    # must be a non-blank string
    @validates("course_name", "course_number", "sponsored_by", "signer_name")
    def validate_required_text(self, key, value):
        if not isinstance(value, str) or not value.strip():
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

    # must be one of that field's allowed values (see _ENUM_FIELDS)
    @validates(*_ENUM_FIELDS.keys())
    def validate_enum_field(self, key, value):
        allowed = _ENUM_FIELDS[key]
        if value not in allowed:
            raise ValueError(f"{key} must be one of {allowed}")
        return value

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "certificate_template_key": self.certificate_template_key,
            "course_name": self.course_name,
            "course_number": self.course_number,
            "course_type": self.course_type,
            "sponsored_by": self.sponsored_by,
            "state": self.state,
            "hours": self.hours,
            "course_category": self.course_category,
            "signer_name": self.signer_name,
        }

    def __repr__(self):
        return f"<Course id={self.id} course_number={self.course_number!r}>"
