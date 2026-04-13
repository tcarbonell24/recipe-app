from flask import Blueprint, jsonify, request
from app.models.item import Item
from app import db

items = Blueprint("items", __name__, url_prefix="/items")


@items.route("/", methods=["GET"])
def get_items():
    all_items = Item.query.all()

    item_list = [
        {
            "id": i.id,
            "item_name": i.item_name,
        }
        for i in all_items
        
    ]

    return jsonify(item_list), 200




# needs a search endpoint to search for item