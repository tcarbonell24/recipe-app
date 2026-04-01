from app import create_app, db
from app.models.item import Item

# Initialize Flask app context
app = create_app()
app.app_context().push()

# Create database tables if they don't exist
db.create_all()

# Clear existing items for testing purposes 
Item.query.delete()
db.session.commit()

# Items objects 
items = [
    Item(
        id = 1,
        item_name = "tomato",
    ),
    Item(
        id = 2,
        item_name = "lettuce",
    ),
    Item(
        id = 3,
        item_name = "bacon",
    ),
]

# Add all items to the session and commit
db.session.add_all(items)
db.session.commit()

total_items = len(items)
print(f"Seeded {total_items} items successfully!")


