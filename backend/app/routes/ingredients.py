from flask import Blueprint, jsonify, request
from app.models.item import Item

ingredients = Blueprint("ingredients", __name__, url_prefix="/ingredients")


@ingredients.route("/search", methods=["GET"])
def search_ingredients():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify([]), 200

    matching_items = (
    Item.query
    .filter(Item.item_name.ilike(f"%{query}%"))
    .order_by(Item.item_name)
    .all()
)

    ingredient_list = [
        {
            "id": item.id,
            "name": item.item_name,
        }
        for item in matching_items
    ]

    return jsonify(ingredient_list), 200