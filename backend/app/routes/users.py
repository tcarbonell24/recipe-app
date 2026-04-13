from flask import Blueprint, jsonify, request
from app.models.user import User
from app import db

users = Blueprint("users", __name__, url_prefix="/users")


@users.route("/", methods=["GET"])
def get_users():
    all_users = User.query.all()

    user_list = [
        {
            "id": i.id,
            "username": i.username,
        }
        for i in all_users
        
    ]

    return jsonify(user_list), 200