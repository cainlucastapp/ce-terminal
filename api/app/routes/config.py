# api/app/routes/config.py

from flask import Blueprint, jsonify

from app.config import (
    CERTIFICATE_TEMPLATE_KEYS,
    COURSE_CATEGORIES,
    COURSE_HOURS,
    COURSE_TYPES,
    LICENSE_PREFIXES,
    LICENSE_SUFFIXES,
    STATES,
)

config_bp = Blueprint("config", __name__, url_prefix="/api/config")


@config_bp.route("", methods=["GET"])
def get_config():
    return jsonify(
        {
            "course_categories": list(COURSE_CATEGORIES),
            "states": list(STATES),
            "course_types": list(COURSE_TYPES),
            "course_hours": list(COURSE_HOURS),
            "certificate_template_keys": list(CERTIFICATE_TEMPLATE_KEYS),
            "license_prefixes": list(LICENSE_PREFIXES),
            "license_suffixes": list(LICENSE_SUFFIXES),
        }
    ), 200
