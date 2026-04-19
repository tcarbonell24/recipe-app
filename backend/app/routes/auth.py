from flask import Blueprint, jsonify, request, session
from app.models.user import User
from app import db

auth = Blueprint("auth", __name__, url_prefix="/auth")


def serialize_user(user):
    return {
        "id": user.id,
        "username": user.username,
    }


@auth.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    if not password:
        return jsonify({"error": "Password is required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify(serialize_user(new_user)), 201


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    session["user_id"] = user.id

    return jsonify(serialize_user(user)), 200


@auth.route("/logout", methods=["DELETE", "POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out successfully"}), 200


@auth.route("/me", methods=["GET"])
def me():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(serialize_user(user)), 200