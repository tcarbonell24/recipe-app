from flask import Blueprint, jsonify, request
from app.models.recipe import Recipe
from app.models.user import User
from app.models.item import Item
from app.models.ingredient import Ingredient
from app import db

recipes = Blueprint("recipes", __name__, url_prefix="/recipes")


def serialize_recipe(recipe):
    return {
        "id": recipe.id,
        "name": recipe.name,
        "description": recipe.description,
        "prep_time": recipe.prep_time,
        "cook_time": recipe.cook_time,
        "servings": recipe.servings,
        "allergy_warnings": recipe.allergy_warnings,
        "user_id": recipe.user_id,
        "user": {
            "id": recipe.user.id,
            "username": recipe.user.username,
        } if recipe.user else None,
        "ingredients": [
            {
                "id": ingredient.id,
                "recipe_id": ingredient.recipe_id,
                "item_id": ingredient.item_id,
                "measurement": ingredient.measurement,
                "item": {
                    "id": ingredient.item.id,
                    "item_name": ingredient.item.item_name,
                } if ingredient.item else None,
            }
            for ingredient in recipe.ingredients
        ],
    }


@recipes.route("/", methods=["GET"])
def get_recipes():
    all_recipes = Recipe.query.all()

    recipe_list = [serialize_recipe(r) for r in all_recipes]

    return jsonify(recipe_list), 200

@recipes.route("/search", methods=["GET"])
def search_recipes():
    query = request.args.get("q", "").strip()

    if not query:
        all_recipes = Recipe.query.all()
        return jsonify([serialize_recipe(recipe) for recipe in all_recipes]), 200

    search_term = f"%{query}%"

    matching_recipes = (
        Recipe.query
        .outerjoin(User, Recipe.user_id == User.id)
        .outerjoin(Ingredient, Ingredient.recipe_id == Recipe.id)
        .outerjoin(Item, Ingredient.item_id == Item.id)
        .filter(
            db.or_(
                Recipe.name.ilike(search_term),
                User.username.ilike(search_term),
                Item.item_name.ilike(search_term),
            )
        )
        .distinct()
        .all()
    )

    return jsonify([serialize_recipe(recipe) for recipe in matching_recipes]), 200


@recipes.route("/<int:id>", methods=["GET"])
def get_recipe_by_id(id):
    recipe = Recipe.query.get(id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    return jsonify(serialize_recipe(recipe)), 200


@recipes.route("/user/<int:user_id>", methods=["GET"])
def get_recipes_by_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_recipes = Recipe.query.filter_by(user_id=user_id).all()

    recipe_list = [serialize_recipe(r) for r in user_recipes]

    return jsonify(recipe_list), 200


@recipes.route("/", methods=["POST"])
def create_recipe():
    data = request.get_json()

    name = data.get("name")
    user_id = data.get("user_id")
    description = data.get("description")
    prep_time = data.get("prep_time")
    cook_time = data.get("cook_time")
    servings = data.get("servings")
    allergy_warnings = data.get("allergy_warnings", False)

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
        user_id=user_id,
        description=description,
        prep_time=prep_time,
        cook_time=cook_time,
        servings=servings,
        allergy_warnings=allergy_warnings,
    )

    db.session.add(new_recipe)
    db.session.commit()

    return jsonify(serialize_recipe(new_recipe)), 201


@recipes.route("/<int:id>", methods=["PATCH"])
def update_recipe(id):
    recipe = Recipe.query.get(id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    data = request.get_json()

    name = data.get("name")
    user_id = data.get("user_id")
    description = data.get("description")
    prep_time = data.get("prep_time")
    cook_time = data.get("cook_time")
    servings = data.get("servings")
    allergy_warnings = data.get("allergy_warnings")

    if name is not None:
        recipe.name = name

    if user_id is not None:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        recipe.user_id = user_id

    if description is not None:
        recipe.description = description

    if prep_time is not None:
        recipe.prep_time = prep_time

    if cook_time is not None:
        recipe.cook_time = cook_time

    if servings is not None:
        recipe.servings = servings

    if allergy_warnings is not None:
        recipe.allergy_warnings = allergy_warnings

    db.session.commit()

    return jsonify(serialize_recipe(recipe)), 200


@recipes.route("/<int:id>", methods=["DELETE"])
def delete_recipe(id):
    recipe = Recipe.query.get(id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    db.session.delete(recipe)
    db.session.commit()

    return jsonify({"message": f"Recipe {id} deleted successfully"}), 200


@recipes.route("/<int:id>/ingredients", methods=["POST"])
def add_ingredient_to_recipe(id):
    recipe = Recipe.query.get(id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    data = request.get_json()

    item_id = data.get("item_id")
    item_name = data.get("item_name")
    measurement = data.get("measurement")

    if not measurement:
        return jsonify({"error": "measurement is required"}), 400

    item = None

    if item_id:
        item = Item.query.get(item_id)
        if not item:
            return jsonify({"error": "Item not found"}), 404

    elif item_name:
        cleaned_name = item_name.strip().lower()

        if not cleaned_name:
            return jsonify({"error": "item_name cannot be empty"}), 400

        item = Item.query.filter_by(item_name=cleaned_name).first()

        if not item:
            item = Item(item_name=cleaned_name)
            db.session.add(item)
            db.session.commit()

    else:
        return jsonify({"error": "item_id or item_name is required"}), 400

    new_ingredient = Ingredient(
        recipe_id=recipe.id,
        item_id=item.id,
        measurement=measurement,
    )

    db.session.add(new_ingredient)
    db.session.commit()

    recipe = Recipe.query.get(id)
    return jsonify(serialize_recipe(recipe)), 201


@recipes.route("/<int:recipe_id>/ingredients/<int:ingredient_id>", methods=["DELETE"])
def remove_ingredient_from_recipe(recipe_id, ingredient_id):
    recipe = Recipe.query.get(recipe_id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    ingredient = Ingredient.query.get(ingredient_id)

    if not ingredient or ingredient.recipe_id != recipe_id:
        return jsonify({"error": "Ingredient not found for this recipe"}), 404

    db.session.delete(ingredient)
    db.session.commit()

    recipe = Recipe.query.get(recipe_id)
    return jsonify(serialize_recipe(recipe)), 200


# post request route: adds ingredient to recipe
# /:id/ingredients
# creates ingredient for recipe.id that gets passed in
# the body of this request will include data for that new ingredient
# item_ID and measurement gets passed in