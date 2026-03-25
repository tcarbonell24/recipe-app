from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    CORS(app, supports_credentials=True)

    db.init_app(app)
    migrate.init_app(app, db)

    # from app.routes.card_routes import cards_bp
    # from app.routes.auth_routes import auth_bp
    # from app.routes.saved_player_routes import saved_players_bp

    # app.register_blueprint(cards_bp)
    # app.register_blueprint(auth_bp)
    # app.register_blueprint(saved_players_bp)

    return app