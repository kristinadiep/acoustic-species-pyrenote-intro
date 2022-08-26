from pickle import FALSE
from sqlalchemy.orm import defaultload
from sqlalchemy.sql.expression import false, null
from werkzeug.security import generate_password_hash, check_password_hash

from backend import app, db
from datetime import datetime

annotation_table = db.Table(
    "annotation",
    db.metadata,
    db.Column("id", db.Integer(), primary_key=True),
    db.Column(
        "segmentation_id",
        db.Integer(),
        db.ForeignKey("segmentation.id"),
        nullable=False,
    ),
    db.Column("created_at", db.DateTime(), nullable=False,
              default=db.func.now()),
    db.Column(
        "last_modified",
        db.DateTime(),
        nullable=False,
        default=db.func.now(),
        onupdate=db.func.utc_timestamp(),
    ),
)

class User(db.Model):
    __tablename__ = "user"

    id = db.Column("id", db.Integer(), primary_key=True)

    username = db.Column(
        "username", db.String(128), index=True, unique=True, nullable=False
    )

    password = db.Column("password", db.String(100), nullable=False)

    role_id = db.Column(
        "role_id", db.Integer(), db.ForeignKey("role.id"), nullable=False
    )

    created_at = db.Column(
        "created_at", db.DateTime(), nullable=False, default=db.func.now()
    )

    last_modified = db.Column(
        "last_modified",
        db.DateTime(),
        nullable=False,
        default=db.func.now(),
        onupdate=db.func.utc_timestamp(),
    )

    role = db.relationship("Role")

    def set_role(self, role_id):
        self.role_id = role_id

    def set_username(self, newUsername):
        self.username = newUsername

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Data(db.Model):
   __tablename__ = "data"
   id = db.Column("id", db.Integer(), primary_key=True)

   created_by = db.Column(
       "created_by", db.String(128), nullable=False,
   )
   filename = db.Column("filename", db.String(100), nullable=False,
                        unique=True)
   original_filename = db.Column("original_filename", db.String(100),
                                 nullable=False)
   is_marked_for_review = db.Column(
       "is_marked_for_review", db.Boolean(), nullable=False, default=False
   )
   created_at = db.Column(
       "created_at", db.DateTime(), nullable=False, default=db.func.now()
   )
   last_modified = db.Column(
       "last_modified",
       db.DateTime(),
       nullable=False,
       default=db.func.now(),
       onupdate=db.func.utc_timestamp(),
   )
   sampling_rate = db.Column("sampling_rate", db.Integer(), nullable=False)
   clip_length = db.Column("clip_length", db.Float(), nullable=False)
   segmentations = db.relationship("Segmentation", backref="Data")
   confident_check = db.Column("confident_check", db.Boolean(), default=False)
   def update_marked_review(self, marked_review):
       self.is_marked_for_review = marked_review
   def set_segmentations(self, segmentations):
       self.segmentations = segmentations
   def set_confident_check(self, confident_check):
       self.confident_check = confident_check
   def to_dict(self):
       return {
           "original_filename": self.original_filename,
           "filename": self.filename,
           "url": f"/audios/{self.filename}",
           "is_marked_for_review": self.is_marked_for_review,
           "created_at": self.created_at,
           "last_modified": self.last_modified,
           "assigned_users": self.assigned_user_id,
           "sampling_rate": self.sampling_rate,
           "clip_length": self.clip_length,
           "confident_check": self.confident_check,
       }

class Segmentation(db.Model):
    __tablename__ = "segmentation"

    id = db.Column("id", db.Integer(), primary_key=True)

    data_id = db.Column(
        "data_id", db.Integer(), db.ForeignKey("data.id"), nullable=False
    )

    start_time = db.Column("start_time", db.Float(), nullable=False)

    end_time = db.Column("end_time", db.Float(), nullable=False)

    max_freq = db.Column("max_freq", db.Float(), nullable=False,
                         default=24000.0)

    min_freq = db.Column("min_freq", db.Float(), nullable=False, default=0.0)

    created_at = db.Column(
        "created_at", db.DateTime(), nullable=False, default=db.func.now()
    )

    created_by = db.Column(
        "created_by", db.String(128), nullable=False,
    )

    last_modified_by = db.Column(
        "last_modified_by", db.JSON(), default={},
    )

    time_spent = db.Column(
        "time_spent", db.Integer(), nullable=True
    )

    last_modified = db.Column(
        "last_modified",
        db.DateTime(),
        nullable=False,
        default=db.func.now(),
        onupdate=db.func.utc_timestamp(),
    )

    time_spent = db.Column(
        "time_spent", db.Float(), nullable=False, default=0.0
    )

    label = db.Column(
        "label", db.String(100), nullable=False, default="bird"
    )

    def set_start_time(self, start_time):
        self.start_time = start_time

    def set_end_time(self, end_time):
        self.end_time = end_time

    def set_time_spent(self, time):
        time_spent = self.time_spent + time
        self.time_spent = time_spent

    def append_modifers(self, newUser):
        if (self.last_modified_by is None):
            self.last_modified_by = {"data": {}}
            app.logger.info("ran")
        date = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        test = self.last_modified_by["data"]
        test[newUser] = date
        self.last_modified_by["data"] = test
        app.logger.info(self.last_modified_by)
        app.logger.info(newUser)

    def set_max_freq(self, max_freq):
        if (max_freq != -1.0):
            self.max_freq = max_freq

    def set_min_freq(self, min_freq):
        if (min_freq != -1.0):
            self.min_freq = min_freq

    def to_dict(self):
        app.logger.info(self.last_modified_by)
        return {
            "start_time": self.start_time,
            "end_time": self.end_time,
            "max_freq": self.max_freq,
            "min_freq": self.min_freq,
            "created_at": self.created_at,
            "created_by": self.created_by,
            "last_modified": self.last_modified,
            "last_modified_by": self.last_modified_by["data"],
            "time_spent": self.time_spent,
        }


class Role(db.Model):
    __tablename__ = "role"

    id = db.Column("id", db.Integer(), primary_key=True)

    role = db.Column("role", db.String(30), index=True, unique=True,
                     nullable=False)

    created_at = db.Column(
        "created_at", db.DateTime(), nullable=False, default=db.func.now()
    )

    last_modified = db.Column(
        "last_modified",
        db.DateTime(),
        nullable=False,
        default=db.func.now(),
        onupdate=db.func.utc_timestamp(),
    )


