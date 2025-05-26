from sqlalchemy.orm import Session
from app.models.user import User
from app.models.badge import Badge, UserBadge

# Define global XP thresholds with gamer-style level names
LEVEL_THRESHOLDS = {
    "Beginner": 0,
    "Novice": 100,
    "Apprentice": 200,
    "Adept": 400,
    "Expert": 700,
    "Master": 1000,
    "Grandmaster": 1500,
}


def calculate_xp(message_length: int) -> int:
    """
    Calculate XP points based on the user's message length.
    """
    base_xp = 10  # Minimum XP for sending any message
    xp_per_char = 0.5  # 0.5 XP per character
    total_xp = base_xp + int(message_length * xp_per_char)
    return total_xp


def add_experience_and_check_level_up(user: User, db: Session):
    """
    Check if the user qualifies for a new level based on XP,
    and update their current_level if needed.
    """
    for level, xp_required in sorted(LEVEL_THRESHOLDS.items(), key=lambda x: x[1]):
        if user.experience_points >= xp_required:
            user.current_level = level

    db.commit()
    db.refresh(user)


def handle_user_xp_and_level_up(user: User, message_length: int, db: Session) -> int:
    """
    Process XP gain from a message and check for level-up.
    Returns the amount of XP earned.
    """
    xp_earned = calculate_xp(message_length)
    user.experience_points += xp_earned
    add_experience_and_check_level_up(user, db)
    return xp_earned

def get_next_level_info(user: User) -> dict:
    """
    Returns the next level name and XP required to reach it.
    If user is at the highest level, returns None.
    """
    current_xp = user.experience_points
    sorted_levels = sorted(LEVEL_THRESHOLDS.items(), key=lambda x: x[1])

    for level, xp_required in sorted_levels:
        if current_xp < xp_required:
            return {
                "next_level": level,
                "xp_needed": xp_required - current_xp
            }

    return {
        "next_level": None,
        "xp_needed": 0  # Already at max level
    }

def award_badge_if_eligible(user: User, db: Session):
    badges_to_award = []

    # Example 1: Award for reaching 100 XP
    if user.experience_points >= 100:
        badge = db.query(Badge).filter(Badge.name == "First 100 XP").first()
        if badge and not any(ub.badge_id == badge.id for ub in user.badges):
            user_badge = UserBadge(user_id=user.id, badge_id=badge.id)
            db.add(user_badge)
            badges_to_award.append(badge.name)

    db.commit()
    return badges_to_award
