import json
import sqlalchemy as sa
import uuid
from datetime import datetime
from pathlib import Path

from flask import jsonify, request
from flask import send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from werkzeug.exceptions import BadRequest, NotFound

from backend import app, db
from backend.models import Data, User, Segmentation
import mutagen

from .helper_functions import general_error, check_admin_permissions
from . import api

ALLOWED_EXTENSIONS = ["wav", "mp3", "ogg"]
@api.route("/data/admin_portal", methods=["POST"])
@jwt_required
def add_data_from_site():
    identity = get_jwt_identity()
    request_user = User.query.filter_by(username=identity["username"]).first()
    is_marked_for_review = True
    file_length = request.form.get("file_length", None)
    app.logger.info(file_length)
    audio_files = []
    for n in range(int(file_length)):
        audio_files.append(request.files.get(str(n)))
    app.logger.info(audio_files)

    for file in audio_files:
        original_filename = secure_filename(file.filename)

        extension = Path(original_filename).suffix.lower()

        if len(extension) > 1 and extension[1:] not in ALLOWED_EXTENSIONS:
            raise BadRequest(description="File format is not supported")

        filename = f"{str(uuid.uuid4().hex)}{extension}"

        file_path = Path(app.config["UPLOAD_FOLDER"]).joinpath(filename)
        file.save(file_path.as_posix())
        metadata = mutagen.File(file_path.as_posix()).info
        frame_rate = metadata.sample_rate
        clip_duration = metadata.length
        try:
            data = Data(
                filename=filename,
                original_filename=original_filename,
                is_marked_for_review=is_marked_for_review,
                created_by=identity["username"],
                sampling_rate=frame_rate,
                clip_length=clip_duration,
            )
        except Exception as e:
            app.logger.error(e)
            raise BadRequest(description="username_id is bad ")
        db.session.add(data)
        db.session.flush()
        db.session.commit()
        db.session.refresh(data)

    return (
        jsonify(
            message=f"Data uploaded successfully",
            type="DATA_CREATED",
        ),
        201,
    )

@api.route("/get_data", methods=["GET"])
@jwt_required
def get_data():
    identity = get_jwt_identity()
    segmentations = db.session.query(Segmentation.data_id
                                         ).distinct().subquery()
    data_pt = Data.query.filter(Data.created_by == identity["username"]).filter(Data.id.notin_(segmentations)).first()
    if (data_pt == None):
        return (
        jsonify(
            data="no data",
            message=f"Data Not Found, Upload or proceed to download",
            type="DATA_NF",
        ),
        404
    )

    return (
        jsonify(
            data=data_pt.filename,
            message=f"Data uploaded successfully",
            type="DATA_CREATED",
        ),
        200
    )


@api.route("/get_labels", methods=["GET"])
@jwt_required
def get_clip_segmentations():
    file = str(request.headers.get("data", "False"))
    app.logger.info(file)
    data = Data.query.filter_by(filename=file).first()
    segments = Segmentation.query.filter_by(data_id=data.id).all()
    response = list(
            [
                {
                    "start": segment.start_time,
                    "end":  segment.end_time,
                    "created_by":  segment.created_by,
                    "created_at": str(segment.created_at)
                }
                for segment in segments
            ]
    )
    app.logger.info(response)

    return (
        jsonify(
            data=response,
            message=f"Data uploaded successfully",
            type="DATA_CREATED",
        ),
        200
    )

## TODO: rename the url to the correct method and url
@api.route("/INSERT_URL", methods=["post"])
@jwt_required
def create_segmentation():
    ## TODO: add backend code to save segmentation!
    ## Use request.json.get("KEY", default) to get values from
    ## uploaded json file from axios on frontend(see data)

    ## How can you create a new row in a table via SQLAlchemy?
    ## How can you upload that data to the database (what are the commit commands you need?)

    ## Don't forget the return message!!!

    ## Below is some example code you can use as refrence:
    example = str(request.json.get("data", "default answer if data key does not exist in request json!!!"))
    app.logger.info(example) # werid print statement sends console output to our local terminal rather than a console in the container!
    
    # this code helps you get the username of the user who sent the api request!
    identity = get_jwt_identity()
    app.logger.info(identity["username"])
    # always return a success code!!
    # 200 usually means the api request was successfully processed.
    success_code = 200

    return (
        jsonify(
            message=f"EXAMPLE",
            type="EXAMPLE",
        ),
        success_code
    )

    