# api/app/routes/certificates.py

from flask import Blueprint, abort, jsonify, request

from app.models.attendee import Attendee
from app.models.course import Course

certificates_bp = Blueprint("certificates", __name__, url_prefix="/api/certificates")


def _search_result(attendee):
    return {
        "public_id": attendee.public_id,
        "course_name": attendee.course.course_name,
        "course_number": attendee.course.course_number,
        "completion_date": attendee.completion_date.isoformat(),
    }


@certificates_bp.route("/search", methods=["GET"])
def search_certificates():
    state = request.args.get("state")
    license_number = request.args.get("license_number")

    # both are required so this route can't be used to enumerate every attendee
    if not state or not license_number:
        return jsonify({"error": "state and license_number are required"}), 400

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = (
        Attendee.query.join(Course)
        .filter(Course.state == state, Attendee.student_license_number == license_number)
        .order_by(Attendee.completion_date.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify(
        {
            "items": [_search_result(attendee) for attendee in pagination.items],
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
        }
    ), 200


@certificates_bp.route("/<public_id>", methods=["GET"])
def get_certificate(public_id):
    attendee = Attendee.query.filter_by(public_id=public_id).first()
    if not attendee:
        abort(404, description="certificate not found")
    course = attendee.course

    # excludes id/user_id/course_id — this is a public, unauthenticated route
    return jsonify(
        {
            "course": {
                "certificate_template_key": course.certificate_template_key,
                "course_name": course.course_name,
                "course_number": course.course_number,
                "course_type": course.course_type,
                "sponsored_by": course.sponsored_by,
                "state": course.state,
                "hours": course.hours,
                "course_category": course.course_category,
                "signer_name": course.signer_name,
            },
            "attendee": {
                "student_name": attendee.student_name,
                "student_license_number": attendee.student_license_number,
                "completion_date": attendee.completion_date.isoformat(),
            },
        }
    ), 200
