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
        name="Spaghetti",
        user_id=1,
        description="Classic spaghetti with tomato sauce.",
        prep_time=15,
        cook_time=25,
        servings=4,
        allergy_warnings=False,
    ),
    Recipe(
        name="Pizza",
        user_id=1,
        description="Homemade pizza with bacon and tomato.",
        prep_time=20,
        cook_time=18,
        servings=4,
        allergy_warnings=False,
    ),
    Recipe(
        name="Salad",
        user_id=2,
        description="Fresh lettuce and tomato salad.",
        prep_time=10,
        cook_time=0,
        servings=2,
        allergy_warnings=False,
    ),
]


# Add all recipes to the session and commit
db.session.add_all(recipes)
db.session.commit()

total_recipes = len(recipes)
print(f"Seeded {total_recipes} recipes successfully!")