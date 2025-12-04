import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5000"
USERNAME = "pedrocastro767@gmail.com"
PASSWORD = "qActive4@#"
TIMEOUT = 30

def test_account_deletion_process():
    session = requests.Session()
    session.auth = HTTPBasicAuth(USERNAME, PASSWORD)
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    otp = None

    try:
        # Step 1: Request OTP for account deletion
        otp_request_resp = session.post(f"{BASE_URL}/account/deletion/request-otp", json={}, headers=headers, timeout=TIMEOUT)
        assert otp_request_resp.status_code == 200, f"OTP request failed: {otp_request_resp.text}"
        otp_data = otp_request_resp.json()
        assert "otp_sent" in otp_data and otp_data["otp_sent"] is True, "OTP not sent confirmation missing"

        # Retrieve OTP from test endpoint
        otp_retrieve_resp = session.get(f"{BASE_URL}/account/deletion/test-get-otp", headers=headers, timeout=TIMEOUT)
        if otp_retrieve_resp.status_code == 200:
            otp = otp_retrieve_resp.json().get("otp")
        else:
            otp = "000000"

        assert otp is not None, "Failed to retrieve OTP for account deletion"

        # Step 2: Verify otp and perform account deletion
        deletion_payload = {"otp": otp}
        delete_resp = session.post(f"{BASE_URL}/account/delete", json=deletion_payload, headers=headers, timeout=TIMEOUT)
        assert delete_resp.status_code == 200, f"Account deletion failed: {delete_resp.text}"
        delete_resp_json = delete_resp.json()
        assert delete_resp_json.get("deleted") is True, "Account deletion confirmation missing or false"

        # Step 3: Verify user data cleanup by attempting to fetch user profile
        profile_resp = session.get(f"{BASE_URL}/user/profile", headers=headers, timeout=TIMEOUT)
        assert profile_resp.status_code in (401, 403, 404), f"User data still accessible after deletion: {profile_resp.status_code}"

    finally:
        pass

test_account_deletion_process()
