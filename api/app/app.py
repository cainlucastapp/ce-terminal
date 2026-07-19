# api/app/app.py

from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

from app.config import Config
from app.extensions import cors, db, login_manager, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    cors.init_app(app, supports_credentials=True, origins=app.config["CORS_ORIGINS"])

    from app.models import attendee, course, user

    # session cookie stores a user id
    @login_manager.user_loader
    def load_user(user_id):
        return user.User.query.get(int(user_id))

    # Unauthenticated requests get JSON, not an HTML page
    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "authentication required"}), 401

    # every abort()/HTTP error gets JSON
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return jsonify({"error": error.description}), error.code

    from app.routes.attendees import attendees_bp
    from app.routes.auth import auth_bp
    from app.routes.certificates import certificates_bp
    from app.routes.courses import courses_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(attendees_bp)
    app.register_blueprint(certificates_bp)

    return app
