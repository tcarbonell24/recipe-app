from app import create_app, db
from app.models.user import User

# Initialize Flask app context
app = create_app()
app.app_context().push()

# Create database tables if they don't exist
db.create_all()

# Clear existing users for testing purposes 
User.query.delete()
db.session.commit()

# Users objects 
users = [
    User(
        id=1,
        username="tom",
        password_hash="password123"
    ),
    User(
        id=2,
        username="sarah",
        password_hash="password123"
    ),
]

# Add all users to the session and commit
db.session.add_all(users)
db.session.commit()

total_users = len(users)
print(f"Seeded {total_users} users successfully!")