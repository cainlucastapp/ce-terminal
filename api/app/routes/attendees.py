# api/app/routes/attendees.py

from datetime import date

from flask import Blueprint, abort, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.attendee import Attendee
from app.models.course import Course

attendees_bp = Blueprint(
    "attendees", __name__, url_prefix="/api/courses/<int:course_id>/attendees"
)


# 404s if the course doesn't exist, 403s if current_user isn't the owner
def _get_owned_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        abort(404)
    if course.user_id != current_user.id:
        abort(403)
    return course


# scoped by both id and course_id so an attendee from a different course
# (even one the user owns) can't be reached through the wrong course_id
def _get_attendee(course, attendee_id):
    attendee = Attendee.query.filter_by(id=attendee_id, course_id=course.id).first()
    if not attendee:
        abort(404)
    return attendee


# JSON has no date type; this parses "YYYY-MM-DD" and raises ValueError otherwise
def _parse_completion_date(value):
    if not value:
        raise ValueError("completion_date is required")
    try:
        return date.fromisoformat(value)
    except (TypeError, ValueError):
        raise ValueError("completion_date must be in YYYY-MM-DD format")


@attendees_bp.route("", methods=["GET"])
@login_required
def list_attendees(course_id):
    course = _get_owned_course(course_id)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = Attendee.query.filter_by(course_id=course.id).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify(
        {
            "items": [attendee.to_dict() for attendee in pagination.items],
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
        }
    ), 200


@attendees_bp.route("", methods=["POST"])
@login_required
def create_attendee(course_id):
    course = _get_owned_course(course_id)
    data = request.get_json(silent=True) or {}

    try:
        attendee = Attendee(
            course_id=course.id,
            student_name=data.get("student_name"),
            student_license_number=data.get("student_license_number"),
            completion_date=_parse_completion_date(data.get("completion_date")),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    db.session.add(attendee)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "this attendee record already exists"}), 409

    return jsonify(attendee.to_dict()), 201


@attendees_bp.route("/<int:attendee_id>", methods=["GET"])
@login_required
def get_attendee(course_id, attendee_id):
    course = _get_owned_course(course_id)
    attendee = _get_attendee(course, attendee_id)
    return jsonify(attendee.to_dict()), 200


@attendees_bp.route("/<int:attendee_id>", methods=["PATCH"])
@login_required
def update_attendee(course_id, attendee_id):
    course = _get_owned_course(course_id)
    attendee = _get_attendee(course, attendee_id)
    data = request.get_json(silent=True) or {}

    try:
        if "student_name" in data:
            attendee.student_name = data["student_name"]
        if "student_license_number" in data:
            attendee.student_license_number = data["student_license_number"]
        if "completion_date" in data:
            attendee.completion_date = _parse_completion_date(data["completion_date"])
    except ValueError as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "this attendee record already exists"}), 409

    return jsonify(attendee.to_dict()), 200


@attendees_bp.route("/<int:attendee_id>", methods=["DELETE"])
@login_required
def delete_attendee(course_id, attendee_id):
    course = _get_owned_course(course_id)
    attendee = _get_attendee(course, attendee_id)

    db.session.delete(attendee)
    db.session.commit()
    return "", 204
