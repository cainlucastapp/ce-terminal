# api/app/routes/courses.py

from flask import Blueprint, abort, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.course import Course

courses_bp = Blueprint("courses", __name__, url_prefix="/api/courses")


@courses_bp.route("", methods=["GET"])
@login_required
def list_courses():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = Course.query.filter_by(user_id=current_user.id).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify(
        {
            "items": [course.to_dict() for course in pagination.items],
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
        }
    ), 200


@courses_bp.route("", methods=["POST"])
@login_required
def create_course():
    data = request.get_json(silent=True) or {}

    try:
        course = Course(
            user_id=current_user.id,
            certificate_template_key=data.get("certificate_template_key"),
            course_name=data.get("course_name"),
            course_number=data.get("course_number"),
            course_type=data.get("course_type"),
            sponsored_by=data.get("sponsored_by"),
            state=data.get("state"),
            hours=data.get("hours"),
            course_category=data.get("course_category"),
            signer_name=data.get("signer_name"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    db.session.add(course)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify(
            {"error": "a course with this state and course_number already exists"}
        ), 409

    return jsonify(course.to_dict()), 201


@courses_bp.route("/<int:course_id>", methods=["GET"])
@login_required
def get_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        abort(404, description="course not found")
    if course.user_id != current_user.id:
        abort(403, description="you don't have access to this course")

    return jsonify(course.to_dict()), 200


@courses_bp.route("/<int:course_id>", methods=["PATCH"])
@login_required
def update_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        abort(404, description="course not found")
    if course.user_id != current_user.id:
        abort(403, description="you don't have access to this course")

    data = request.get_json(silent=True) or {}

    try:
        if "certificate_template_key" in data:
            course.certificate_template_key = data["certificate_template_key"]
        if "course_name" in data:
            course.course_name = data["course_name"]
        if "course_number" in data:
            course.course_number = data["course_number"]
        if "course_type" in data:
            course.course_type = data["course_type"]
        if "sponsored_by" in data:
            course.sponsored_by = data["sponsored_by"]
        if "state" in data:
            course.state = data["state"]
        if "hours" in data:
            course.hours = data["hours"]
        if "course_category" in data:
            course.course_category = data["course_category"]
        if "signer_name" in data:
            course.signer_name = data["signer_name"]
    except ValueError as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify(
            {"error": "a course with this state and course_number already exists"}
        ), 409

    return jsonify(course.to_dict()), 200


@courses_bp.route("/<int:course_id>", methods=["DELETE"])
@login_required
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        abort(404, description="course not found")
    if course.user_id != current_user.id:
        abort(403, description="you don't have access to this course")

    db.session.delete(course)
    db.session.commit()
    return "", 204
