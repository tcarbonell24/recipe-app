from app import db

class Recipe(db.Model):
    __tablename__ = "recipes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    #user = db.relationship("User", backref="Recipes")
    # description
    # prep_time in minutes
    # cook time in minutes
    # servings
    # allergy warnings (bool)