# api/app/config.py

# These tuples are the single source of truth for both the frontend dropdown
# options and the backend model validators (see app/models/course.py).
#
# Adding new values is safe and low-friction — just append to the relevant
# tuple and it will show up in the dropdowns and pass validation immediately.
#
# Renaming or removing a value is NOT safe on its own. Any existing rows in
# the database that reference the old value will fail future validation on
# update (and won't match the new dropdown options in the UI). If you rename
# or remove a value, you must first migrate existing rows to the new value
# (or a valid replacement) before deploying the config change.
#
# TODO: Implement administrative controls to update field values safely
# (i.e. a tool/workflow that renames a value here AND updates all matching
# rows in the database in the same operation, rather than editing this file
# by hand and hoping nothing breaks).


# Course.course_category
COURSE_CATEGORIES = (
    "Agency",
    "Broker Management",
    "Business Broker",
    "Ethics",
    "Contracts",
    "General",
    "Law",
    "Property Management",
    "Risk Reduction",
)

# Course.state
STATES = ("Nevada",)

# Course.course_type
COURSE_TYPES = ("classroom", "internet")

# Course.hours
COURSE_HOURS = (1, 3)

# Course.certificate_template_key
CERTIFICATE_TEMPLATE_KEYS = ("NRED",)
