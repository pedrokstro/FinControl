import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5000"
USERNAME = "pedrocastro767@gmail.com"
PASSWORD = "qActive4@#"
TIMEOUT = 30

def test_authentication_system_endpoints():
    """
    Test all authentication related endpoints including:
    - Registration
    - Email verification
    - Login
    - Password reset flow
    - JWT token management
    Ensuring secure and reliable user authentication flows.
    """
    session = requests.Session()
    session.auth = HTTPBasicAuth(USERNAME, PASSWORD)
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    user_data = {
        "email": "testuser+pythontest@example.com",
        "password": "StrongPassw0rd!@#",
        "full_name": "Python Test User"
    }

    user_id = None

    # 1. Register a new user
    register_url = f"{BASE_URL}/api/auth/register"
    try:
        register_resp = session.post(register_url, json=user_data, headers=headers, timeout=TIMEOUT)
        assert register_resp.status_code in (200, 201), f"Registration failed: {register_resp.text}"
        reg_json = register_resp.json()
        assert "userId" in reg_json or "id" in reg_json, "User ID not returned on registration"

        user_id = reg_json.get("userId") or reg_json.get("id")

        # 2. Simulate email verification - generally requires a token from email
        # Assuming API endpoint to verify email via token, we mock this by requesting the verification token endpoint
        verify_email_url = f"{BASE_URL}/api/auth/verify-email"
        # Normally token comes from email; here trying to request token for testing purpose
        request_token_resp = session.post(f"{BASE_URL}/api/auth/request-email-verification", json={"email": user_data["email"]}, headers=headers, timeout=TIMEOUT)
        assert request_token_resp.status_code == 200, f"Email verification token request failed: {request_token_resp.text}"
        token_json = request_token_resp.json()
        assert "verificationToken" in token_json, "Verification token not received"
        verification_token = token_json["verificationToken"]

        verify_resp = session.post(verify_email_url, json={"token": verification_token}, headers=headers, timeout=TIMEOUT)
        assert verify_resp.status_code == 200, f"Email verification failed: {verify_resp.text}"

        # 3. Login with the newly registered user
        login_url = f"{BASE_URL}/api/auth/login"
        login_payload = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        login_resp = session.post(login_url, json=login_payload, headers=headers, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        login_json = login_resp.json()
        assert "accessToken" in login_json, "Access token missing in login response"
        assert "refreshToken" in login_json, "Refresh token missing in login response"

        access_token = login_json["accessToken"]
        refresh_token = login_json["refreshToken"]
        auth_headers = headers.copy()
        auth_headers["Authorization"] = f"Bearer {access_token}"

        # 4. Validate JWT token by accessing a protected endpoint (assuming /api/auth/profile)
        profile_url = f"{BASE_URL}/api/auth/profile"
        profile_resp = session.get(profile_url, headers=auth_headers, timeout=TIMEOUT)
        assert profile_resp.status_code == 200, f"Accessing protected profile endpoint failed: {profile_resp.text}"
        profile_data = profile_resp.json()
        assert profile_data.get("email") == user_data["email"], "Profile email does not match logged in user"

        # 5. Refresh JWT token using refresh token endpoint
        refresh_url = f"{BASE_URL}/api/auth/token/refresh"
        refresh_resp = session.post(refresh_url, json={"refreshToken": refresh_token}, headers=headers, timeout=TIMEOUT)
        assert refresh_resp.status_code == 200, f"Token refresh failed: {refresh_resp.text}"
        refresh_json = refresh_resp.json()
        assert "accessToken" in refresh_json, "New access token missing after refresh"

        new_access_token = refresh_json["accessToken"]

        # 6. Password reset flow
        # 6a. Request password reset token
        forgot_password_url = f"{BASE_URL}/api/auth/forgot-password"
        forgot_resp = session.post(forgot_password_url, json={"email": user_data["email"]}, headers=headers, timeout=TIMEOUT)
        assert forgot_resp.status_code == 200, f"Forgot password request failed: {forgot_resp.text}"
        forgot_json = forgot_resp.json()
        assert "resetToken" in forgot_json, "Reset token missing in forgot password response"
        reset_token = forgot_json["resetToken"]

        # 6b. Reset password with token
        new_password = "NewStrongPassw0rd!@#"
        reset_password_url = f"{BASE_URL}/api/auth/reset-password"
        reset_payload = {
            "token": reset_token,
            "newPassword": new_password
        }
        reset_resp = session.post(reset_password_url, json=reset_payload, headers=headers, timeout=TIMEOUT)
        assert reset_resp.status_code == 200, f"Password reset failed: {reset_resp.text}"

        # 6c. Login with new password
        login_new_payload = {
            "email": user_data["email"],
            "password": new_password
        }
        login_new_resp = session.post(login_url, json=login_new_payload, headers=headers, timeout=TIMEOUT)
        assert login_new_resp.status_code == 200, f"Login with new password failed: {login_new_resp.text}"
        login_new_json = login_new_resp.json()
        assert "accessToken" in login_new_json, "Access token missing after login with new password"

    finally:
        # Clean up - delete created user if possible (needs auth token or basic auth)
        if user_id is not None:
            delete_user_url = f"{BASE_URL}/api/auth/users/{user_id}"
            try:
                # Attempt delete with basic auth for cleanup
                del_resp = session.delete(delete_user_url, headers=headers, timeout=TIMEOUT)
                # Allow either 200 or 204 as success
                assert del_resp.status_code in (200, 204, 404), f"User deletion failed: {del_resp.status_code} {del_resp.text}"
            except Exception:
                # Ignore errors during cleanup
                pass

test_authentication_system_endpoints()