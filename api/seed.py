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

    user = User(
        first_name="David",
        last_name="Lastname",
        email="test@example.com",
    )
    user.password = "password123"

    db.session.add(user)
    db.session.commit()

    # ------------------------------------------------------------------
    # Courses, in the style of the Agent Formula catalog
    # ------------------------------------------------------------------

    course_1 = Course(
        user_id=user.id,
        certificate_template_key="NRED",
        course_name="Ethics Under Pressure: Real World Decisions",
        course_number="CE.8001000-RE",
        course_type="classroom",
        sponsored_by="CE Terminal",
        state="Nevada",
        hours=3,
        course_category="Ethics",
        signer_name="Cain Tapp",
    )

    course_2 = Course(
        user_id=user.id,
        certificate_template_key="NRED",
        course_name="Mastering the Purchase Agreement",
        course_number="CE.8002000-RE",
        course_type="internet",
        sponsored_by="CE Terminal",
        state="Nevada",
        hours=1,
        course_category="Contracts",
        signer_name="Cain Tapp",
    )

    course_3 = Course(
        user_id=user.id,
        certificate_template_key="NRED",
        course_name="Nevada Real Estate Law Update",
        course_number="CE.8003000-RE",
        course_type="classroom",
        sponsored_by="CE Terminal",
        state="Nevada",
        hours=3,
        course_category="Law",
        signer_name="David Lastname",
    )

    course_4 = Course(
        user_id=user.id,
        certificate_template_key="NRED",
        course_name="Avoiding Liability: Risk Reduction Essentials",
        course_number="CE.8004000-RE",
        course_type="classroom",
        sponsored_by="CE Terminal",
        state="Nevada",
        hours=3,
        course_category="Risk Reduction",
        signer_name="David Lastname",
    )

    courses = [course_1, course_2, course_3, course_4]

    db.session.add_all(courses)
    db.session.commit()

    # ------------------------------------------------------------------
    # Attendees — Ethics Under Pressure
    # ------------------------------------------------------------------

    attendees_course_1 = [
        Attendee(
            course_id=course_1.id,
            student_name="Melissa Grant",
            student_license_number="S.0041872",
            completion_date=date(2026, 1, 14),
        ),
        Attendee(
            course_id=course_1.id,
            student_name="Brian Ostrowski",
            student_license_number="BS.0057213.LLC",
            completion_date=date(2026, 1, 22),
        ),
        Attendee(
            course_id=course_1.id,
            student_name="Courtney Hale",
            student_license_number="S.0039981",
            completion_date=date(2026, 2, 2),
        ),
        Attendee(
            course_id=course_1.id,
            student_name="Derek Alvarado",
            student_license_number="PM.0012456",
            completion_date=date(2026, 2, 19),
        ),
        Attendee(
            course_id=course_1.id,
            student_name="Natalie Voss",
            student_license_number="S.0064410",
            completion_date=date(2026, 3, 3),
        ),
    ]

    # ------------------------------------------------------------------
    # Attendees — Mastering the Purchase Agreement
    # ------------------------------------------------------------------

    attendees_course_2 = [
        Attendee(
            course_id=course_2.id,
            student_name="Anthony Ruiz",
            student_license_number="S.0028871",
            completion_date=date(2026, 1, 9),
        ),
        Attendee(
            course_id=course_2.id,
            student_name="Samantha Cole",
            student_license_number="BS.0074512.INDV",
            completion_date=date(2026, 1, 27),
        ),
        Attendee(
            course_id=course_2.id,
            student_name="Trevor Nakamura",
            student_license_number="S.0055209",
            completion_date=date(2026, 2, 11),
        ),
        Attendee(
            course_id=course_2.id,
            student_name="Paige Whitfield",
            student_license_number="S.0011238",
            completion_date=date(2026, 2, 24),
        ),
        Attendee(
            course_id=course_2.id,
            student_name="Marcus Delgado",
            student_license_number="PM.0033765",
            completion_date=date(2026, 3, 8),
        ),
        Attendee(
            course_id=course_2.id,
            student_name="Ivy Sorensen",
            student_license_number="S.0062974",
            completion_date=date(2026, 3, 19),
        ),
    ]

    # ------------------------------------------------------------------
    # Attendees — Nevada Real Estate Law Update
    # ------------------------------------------------------------------

    attendees_course_3 = [
        Attendee(
            course_id=course_3.id,
            student_name="Gregory Pham",
            student_license_number="S.0048823",
            completion_date=date(2026, 1, 16),
        ),
        Attendee(
            course_id=course_3.id,
            student_name="Hannah Ostroff",
            student_license_number="BS.0091247.LLC",
            completion_date=date(2026, 2, 5),
        ),
        Attendee(
            course_id=course_3.id,
            student_name="Elijah Marsh",
            student_license_number="S.0037650",
            completion_date=date(2026, 2, 21),
        ),
        Attendee(
            course_id=course_3.id,
            student_name="Lauren Dietrich",
            student_license_number="S.0069124",
            completion_date=date(2026, 3, 6),
        ),
        Attendee(
            course_id=course_3.id,
            student_name="Curtis Yang",
            student_license_number="PM.0025683",
            completion_date=date(2026, 3, 24),
        ),
    ]

    # ------------------------------------------------------------------
    # Attendees — Avoiding Liability: Risk Reduction Essentials
    # (large roster, to exercise attendee list pagination — 10 per page)
    # ------------------------------------------------------------------

    attendees_course_4 = [
        Attendee(
            course_id=course_4.id,
            student_name="Whitney Sargent",
            student_license_number="S.0074512",
            completion_date=date(2025, 8, 12),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Owen Castellano",
            student_license_number="BS.0038291.LLC",
            completion_date=date(2025, 9, 3),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Priya Nandakumar",
            student_license_number="S.0091247",
            completion_date=date(2025, 10, 22),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Kyle Ferrante",
            student_license_number="PM.0056783",
            completion_date=date(2025, 11, 15),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Bianca Whitlock",
            student_license_number="S.0012098",
            completion_date=date(2025, 12, 1),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Julian Petrov",
            student_license_number="BS.0067452.INDV",
            completion_date=date(2026, 1, 10),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Renee Callahan",
            student_license_number="S.0083671",
            completion_date=date(2026, 1, 25),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Marcus Ihejirika",
            student_license_number="S.0029456",
            completion_date=date(2026, 2, 3),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Sabrina Locke",
            student_license_number="PM.0044821",
            completion_date=date(2026, 2, 18),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Tobias Winslow",
            student_license_number="S.0058732",
            completion_date=date(2026, 3, 5),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Camille Duarte",
            student_license_number="BS.0071293.LLC",
            completion_date=date(2026, 3, 12),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Desmond Okafor",
            student_license_number="S.0036812",
            completion_date=date(2026, 3, 21),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Yvette Marchetti",
            student_license_number="S.0092471",
            completion_date=date(2026, 4, 2),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Preston Aldana",
            student_license_number="PM.0018563",
            completion_date=date(2026, 4, 14),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Fatima Rasheed",
            student_license_number="S.0064128",
            completion_date=date(2026, 4, 29),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Colton Bramwell",
            student_license_number="BS.0053917.INDV",
            completion_date=date(2026, 5, 7),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Selena Okoro",
            student_license_number="S.0027845",
            completion_date=date(2026, 5, 19),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Grant Vasquez",
            student_license_number="S.0081392",
            completion_date=date(2026, 5, 28),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Nadia Ellison",
            student_license_number="PM.0039674",
            completion_date=date(2026, 6, 1),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Reuben Kowalski",
            student_license_number="S.0046218",
            completion_date=date(2026, 6, 16),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Isla Fontaine",
            student_license_number="BS.0088142.LLC",
            completion_date=date(2026, 6, 30),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Dominic Alcaraz",
            student_license_number="S.0015937",
            completion_date=date(2026, 7, 8),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Georgia Beaumont",
            student_license_number="S.0072654",
            completion_date=date(2026, 7, 22),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Lucas Ferreira",
            student_license_number="PM.0021489",
            completion_date=date(2025, 10, 5),
        ),
        Attendee(
            course_id=course_4.id,
            student_name="Wynne Halloran",
            student_license_number="S.0059823",
            completion_date=date(2026, 2, 27),
        ),
    ]

    attendees = attendees_course_1 + attendees_course_2 + attendees_course_3 + attendees_course_4

    db.session.add_all(attendees)
    db.session.commit()

    print("Seeded database:")
    print(f"  User: {user.email} / password123")
    print(f"  Total courses: {Course.query.count()}")
    print(f"  Total attendees: {Attendee.query.count()}")
    print()
    print("Courses:")

    for course in courses:
        print(
            f"  id={course.id} | "
            f"{course.course_number} | "
            f"{course.course_category} | "
            f"{course.course_name}"
        )
