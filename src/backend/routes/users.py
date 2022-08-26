from wsgiref import headers
import sqlalchemy as sa

from flask import jsonify, request
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    get_jwt_identity,
    get_jti,
)
from .helper_functions import (
    check_admin_permissions,
    check_admin,
    general_error,
    missing_data,
    check_login
)

from backend import app, db, redis_client
from backend.models import User, Role
from . import api

@api.route("/create_users", methods=["POST"])
def create_user():
    app.logger.inforequest(request)
    if not request.headers:
        return jsonify(message="Missing JSON in request"), 400

    username = request.json.get("username", None)
    password = request.json.get("password", None)
    role_id = "2"

    msg, status = check_login(username, password, role_id)
    if msg is not None:
        return msg, status

    try:
        user = User(username=username, role_id=role_id)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)
    except Exception as e:
        if type(e) == sa.exc.IntegrityError:
            app.logger.error(f"User {username} already exists!")
            return (jsonify(message="User already exists!",
                    type="DUPLICATE_USER"), 409)
        app.logger.error("Error creating user")
        app.logger.error(e)
        return jsonify(message="Error creating user!"), 500

    return jsonify(user_id=user.id, message="User has been created!"), 201