# api/app/utils/helpers.py

from flask import request


# get_json(silent=True) can return non-dict JSON (an array, string, number,
# null) if that's what the client sent; treat anything that isn't a dict as
# an empty body so route handlers can safely call .get() on the result
def get_json_body():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


# clamps page/per_page from the query string to sane bounds; page is capped
# too, not just floored, so a huge value can't force a huge OFFSET in the query
def get_pagination_params():
    page = min(max(request.args.get("page", 1, type=int), 1), 10_000)
    per_page = min(max(request.args.get("per_page", 10, type=int), 1), 100)
    return page, per_page
