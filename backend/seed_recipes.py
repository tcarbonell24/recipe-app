from app import create_app, db
from app.models.recipe import Recipe
from app.models.user import User

# Initialize Flask app context
app = create_app()
app.app_context().push()

# Create database tables if they don't exist
db.create_all()

# Clear existing recipes for testing purposes 
Recipe.query.delete()
db.session.commit()

# Recipes objects 
recipes = [
    Recipe(
        id=1,
        name="Spaghetti",
        user_id=1
    ),
    Recipe(
        id=2,
        name="Pizza",
        user_id=1
    ),
    Recipe(
        id=3,
        name="Salad",
        user_id=2
    ),
]

# Add all recipes to the session and commit
db.session.add_all(recipes)
db.session.commit()

total_recipes = len(recipes)
print(f"Seeded {total_recipes} recipes successfully!")