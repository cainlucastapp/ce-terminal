# api/seed.py

from datetime import date

from app.app import create_app
from app.extensions import db
from app.models.attendee import Attendee
from app.models.course import Course
from app.models.user import User

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    user = User(first_name="Test", last_name="Provider", email="test@example.com")
    user.password = "password123"
    db.session.add(user)
    db.session.commit()

    course_1 = Course(
        user_id=user.id,
        certificate_template_key="NRED",
        course_name="Ethics in Real Estate",
        course_number="ETH-101",
        course_type="classroom",
        sponsored_by="Acme CE Provider",
        state="Nevada",
        hours=3,
        course_category="Ethics",
        signer_name="Jane Signer",
    )
    course_2 = Course(
        user_id=user.id,
        course_name="Fair Housing Basics",
        course_number="FH-200",
        course_type="internet",
        sponsored_by="Acme CE Provider",
        state="Nevada",
        hours=1,
        course_category="General",
        signer_name="Jane Signer",
    )
    db.session.add_all([course_1, course_2])
    db.session.commit()

    attendee_1 = Attendee(
        course_id=course_1.id,
        student_name="Sam Student",
        student_license_number="NV-12345",
        completion_date=date(2026, 1, 15),
    )
    attendee_2 = Attendee(
        course_id=course_1.id,
        student_name="Alex Attendee",
        student_license_number="NV-67890",
        completion_date=date(2026, 1, 15),
    )
    attendee_3 = Attendee(
        course_id=course_2.id,
        student_name="Sam Student",
        student_license_number="NV-12345",
        completion_date=date(2026, 2, 1),
    )
    db.session.add_all([attendee_1, attendee_2, attendee_3])
    db.session.commit()

    print("Seeded database:")
    print(f"  User:      {user.email} / password123")
    print(f"  Course 1:  id={course_1.id}  {course_1.course_number}  {course_1.course_name}")
    print(f"  Course 2:  id={course_2.id}  {course_2.course_number}  {course_2.course_name}")
    print(f"  Attendee 1: id={attendee_1.id}  public_id={attendee_1.public_id}")
    print(f"  Attendee 2: id={attendee_2.id}  public_id={attendee_2.public_id}")
    print(f"  Attendee 3: id={attendee_3.id}  public_id={attendee_3.public_id}")
