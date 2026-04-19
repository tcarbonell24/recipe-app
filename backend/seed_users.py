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

# Create users with hashed passwords
user1 = User(id=1, username="tom")
user1.set_password("password123")

user2 = User(id=2, username="sarah")
user2.set_password("password123")

user3 = User(id=3, username="alex")
user3.set_password("password123")

# Add all users to the session and commit
users = [user1, user2, user3]

db.session.add_all(users)
db.session.commit()

print(f"Seeded {len(users)} users successfully!")