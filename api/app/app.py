# api/app/app.py

from flask import Flask, jsonify

from app.config import Config
from app.extensions import db, login_manager, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    from app.models import attendee, course, user

    # session cookie stores a user id
    @login_manager.user_loader
    def load_user(user_id):
        return user.User.query.get(int(user_id))

    # Unauthenticated requests get JSON, not an HTML page
    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "authentication required"}), 401

    from app.routes.auth import auth_bp

    app.register_blueprint(auth_bp)

    return app
