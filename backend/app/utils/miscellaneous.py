from datetime import timedelta

def to_nearest_hour(t):
    """
    Rounds supplied datetime to nearest hour
    """
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour) + timedelta(hours=t.minute//30)) 