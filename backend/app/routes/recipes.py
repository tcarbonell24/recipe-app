from flask import Blueprint, jsonify, request
from app.models.recipe import Recipe
from app.models.user import User
from app import db

recipes = Blueprint("recipes", __name__, url_prefix="/recipes")


@recipes.route("/", methods=["GET"])
def get_recipes():
    all_recipes = Recipe.query.all()

    recipe_list = [
        {
            "id": r.id,
            "name": r.name,
            "user_id": r.user_id,
            "user": {
                "id": r.user.id,
                "username": r.user.username,
            } if r.user else None
        }
        for r in all_recipes
    ]

    return jsonify(recipe_list), 200


@recipes.route("/<int:id>", methods=["GET"])
def get_recipe_by_id(id):
    recipe = Recipe.query.get(id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    recipe_data = {
        "id": recipe.id,
        "name": recipe.name,
        "user_id": recipe.user_id,
        "user": {
            "id": recipe.user.id,
            "username": recipe.user.username,
        } if recipe.user else None
    }

    return jsonify(recipe_data), 200


@recipes.route("/user/<int:user_id>", methods=["GET"])
def get_recipes_by_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_recipes = Recipe.query.filter_by(user_id=user_id).all()

    recipe_list = [
        {
            "id": r.id,
            "name": r.name,
            "user_id": r.user_id,
            "user": {
                "id": r.user.id,
                "username": r.user.username,
            } if r.user else None
        }
        for r in user_recipes
    ]

    return jsonify(recipe_list), 200


@recipes.route("/", methods=["POST"])
def create_recipe():
    data = request.get_json()

    name = data.get("name")
    user_id = data.get("user_id")

    if not name:
        return jsonify({"error": "Recipe name is required"}), 400

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    existing_recipe = Recipe.query.filter_by(name=name).first()
    if existing_recipe:
        return jsonify({"error": "Recipe name already exists"}), 400

    new_recipe = Recipe(
        name=name,
        user_id=user_id
    )

    db.session.add(new_recipe)
    db.session.commit()

    recipe_data = {
        "id": new_recipe.id,
        "name": new_recipe.name,
        "user_id": new_recipe.user_id,
        "user": {
            "id": user.id,
            "username": user.username,
        }
    }

    return jsonify(recipe_data), 201


@recipes.route("/<int:id>", methods=["PATCH"])
def update_recipe(id):
    recipe = Recipe.query.get(id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    data = request.get_json()

    name = data.get("name")
    user_id = data.get("user_id")

    if name is not None:
        recipe.name = name

    if user_id is not None:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        recipe.user_id = user_id

    db.session.commit()

    recipe_data = {
        "id": recipe.id,
        "name": recipe.name,
        "user_id": recipe.user_id,
        "user": {
            "id": recipe.user.id,
            "username": recipe.user.username,
        } if recipe.user else None
    }

    return jsonify(recipe_data), 200


@recipes.route("/<int:id>", methods=["DELETE"])
def delete_recipe(id):
    recipe = Recipe.query.get(id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    db.session.delete(recipe)
    db.session.commit()

    return jsonify({"message": f"Recipe {id} deleted successfully"}), 200


# post request route: adds ingredient to recipe
# /:id/ingredients
# creates ingredient for recipe.id that gets passed in
# the body of this request will include data for that new ingredient
# item_ID and measurement gets passed in