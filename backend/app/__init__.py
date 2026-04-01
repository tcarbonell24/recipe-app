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
    
    with app.app_context():
        from app.models import User, Recipe, Item, Ingredient

    # from app.routes.card_routes import recipes_bp
    # from app.routes.auth_routes import auth_bp
    # from app.routes.saved_player_routes import saved_players_bp

    # app.register_blueprint(recipes_bp)
    # app.register_blueprint(auth_bp)
    # app.register_blueprint(saved_players_bp)

    return app