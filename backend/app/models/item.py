from app import db

class Item(db.Model):
    __tablename__ = "items"

    
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(80), unique=True, nullable=False)
