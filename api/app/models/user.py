# api/app/models/user.py

import re
from datetime import datetime, timezone

import bcrypt
from flask_login import UserMixin
from sqlalchemy.orm import validates

from app.extensions import db

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc),)

    # must not be blank
    @validates("first_name", "last_name")
    def validate_name(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} is required")
        return value.strip()

    # must match a basic email shape
    @validates("email")
    def validate_email(self, key, value):
        if not value or not value.strip():
            raise ValueError("email is malformed")
        cleaned = value.strip().lower()
        if not EMAIL_PATTERN.match(cleaned):
            raise ValueError("email is malformed")
        return cleaned

    # write-only; there is no way to read a password back out
    @property
    def password(self):
        raise AttributeError("password is write-only and cannot be read")

    # hashes and stores the plaintext password
    @password.setter
    def password(self, plaintext):
        if not plaintext or len(plaintext) < 8:
            raise ValueError("password must be at least 8 characters long")
        encoded = plaintext.encode("utf-8")
        if len(encoded) > 72:
            raise ValueError("password must be 72 bytes or fewer")
        self.password_hash = bcrypt.hashpw(encoded, bcrypt.gensalt()).decode("utf-8")

    # compares a login attempt against the stored hash
    def check_password(self, plaintext):
        if not self.password_hash:
            return False
        return bcrypt.checkpw(
            plaintext.encode("utf-8"), self.password_hash.encode("utf-8")
        )

    # never includes password_hash
    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
        }

    def __repr__(self):
        return f"<User id={self.id} email={self.email!r}>"
