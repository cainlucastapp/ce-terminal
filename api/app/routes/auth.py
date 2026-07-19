# api/app/routes/auth.py

from flask import Blueprint, jsonify, request
from flask_login import login_required, login_user, logout_user
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}

    try:
        user = User(
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            email=data.get("email"),
        )
        user.password = data.get("password")
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "email is already registered"}), 409

    login_user(user)
    return jsonify(user.to_dict()), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "invalid email or password"}), 401

    login_user(user)
    return jsonify(user.to_dict()), 200


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return "", 204
