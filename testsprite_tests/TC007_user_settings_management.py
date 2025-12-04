import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5000"
AUTH = HTTPBasicAuth("pedrocastro767@gmail.com", "qActive4@#")
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_user_settings_management():
    # 1. Get current user profile
    profile_url = f"{BASE_URL}/user/profile"
    theme_url = f"{BASE_URL}/user/theme"
    security_url = f"{BASE_URL}/user/security"

    try:
        # Fetch current profile
        r = requests.get(profile_url, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert r.status_code == 200
        profile_before = r.json()
        assert "email" in profile_before and isinstance(profile_before["email"], str)
        assert "name" in profile_before and isinstance(profile_before["name"], str)

        # Update user profile - only update 'name' as per PRD
        updated_profile_data = {
            "name": "Pedro Castro Updated"
        }
        r = requests.put(profile_url, json=updated_profile_data, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert r.status_code == 200
        updated_profile = r.json()
        assert updated_profile.get("name") == updated_profile_data["name"]

        # Verify profile update persisted
        r = requests.get(profile_url, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert r.status_code == 200
        profile_after = r.json()
        assert profile_after.get("name") == updated_profile_data["name"]

        # Update theme preference (assume theme can be 'light' or 'dark')
        current_theme = profile_after.get("theme", "light")
        new_theme = "dark" if current_theme == "light" else "light"
        r = requests.put(theme_url, json={"theme": new_theme}, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert r.status_code == 200
        theme_response = r.json()
        assert theme_response.get("theme") == new_theme

        # Verify theme preference persisted
        r = requests.get(theme_url, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert r.status_code == 200
        theme_after = r.json()
        assert theme_after.get("theme") == new_theme

        # Change account security settings - change password
        new_password = "NewP@ssword123!"
        security_change_payload = {
            "current_password": "qActive4@#",
            "new_password": new_password,
            "confirm_new_password": new_password
        }
        r = requests.put(security_url, json=security_change_payload, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert r.status_code == 200
        security_response = r.json()
        assert security_response.get("message") and "success" in security_response.get("message").lower()

        # Revert password change
        security_revert_payload = {
            "current_password": new_password,
            "new_password": "qActive4@#",
            "confirm_new_password": "qActive4@#"
        }
        r = requests.put(security_url, json=security_revert_payload, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert r.status_code == 200
        revert_response = r.json()
        assert revert_response.get("message") and "success" in revert_response.get("message").lower()

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"
    except AssertionError as e:
        raise

test_user_settings_management()
