from app import create_app, db
from app.models.ingredient import Ingredient
from app.models.item import Item
from app.models.recipe import Recipe

# Initialize Flask app context
app = create_app()
app.app_context().push()

# Create database tables if they don't exist
db.create_all()

# Clear existing ingredients for testing purposes 
Ingredient.query.delete()
db.session.commit()

# Ingredients objects 
ingredients = [
    Ingredient(
        id=1,
        item_id=1,
        recipe_id=1,
        measurement="2 cups"
    ),
    Ingredient(
        id=2,
        item_id=2,
        recipe_id=3,
        measurement="1 head"
    ),
    Ingredient(
        id=3,
        item_id=3,
        recipe_id=2,
        measurement="4 strips"
    ),
]

# Add all ingredients to the session and commit
db.session.add_all(ingredients)
db.session.commit()

total_ingredients = len(ingredients)
print(f"Seeded {total_ingredients} ingredients successfully!")