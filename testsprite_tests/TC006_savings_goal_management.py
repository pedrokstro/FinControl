import requests
from requests.auth import HTTPBasicAuth
import datetime

BASE_URL = "http://localhost:5000"
AUTH = HTTPBasicAuth("pedrocastro767@gmail.com", "qActive4@#")
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30


def test_savings_goal_management():
    goal_id = None
    try:
        # Create a new savings goal
        create_payload = {
            "name": "Test Goal",
            "target_amount": 1000.0,
            "current_amount": 100.0,
            "deadline": (datetime.datetime.now() + datetime.timedelta(days=60)).strftime("%Y-%m-%d")
        }
        create_resp = requests.post(
            f"{BASE_URL}/api/savings-goals",
            json=create_payload,
            headers=HEADERS,
            auth=AUTH,
            timeout=TIMEOUT
        )
        assert create_resp.status_code == 201, f"Unexpected status code on creation: {create_resp.status_code}"
        create_data = create_resp.json()
        assert "id" in create_data, "Response JSON missing 'id' after creation"
        goal_id = create_data["id"]
        assert create_data["name"] == create_payload["name"]
        assert abs(create_data["target_amount"] - create_payload["target_amount"]) < 0.001
        assert abs(create_data["current_amount"] - create_payload["current_amount"]) < 0.001
        assert create_data["deadline"] == create_payload["deadline"]

        # Update the savings goal: increase current_amount and change deadline
        new_current_amount = 300.0
        new_deadline_date = (datetime.datetime.now() + datetime.timedelta(days=90)).strftime("%Y-%m-%d")
        update_payload = {
            "name": "Test Goal Updated",
            "target_amount": 1500.0,
            "current_amount": new_current_amount,
            "deadline": new_deadline_date
        }
        update_resp = requests.put(
            f"{BASE_URL}/api/savings-goals/{goal_id}",
            json=update_payload,
            headers=HEADERS,
            auth=AUTH,
            timeout=TIMEOUT
        )
        assert update_resp.status_code == 200, f"Unexpected status code on update: {update_resp.status_code}"
        update_data = update_resp.json()
        assert update_data["name"] == update_payload["name"]
        assert abs(update_data["target_amount"] - update_payload["target_amount"]) < 0.001
        assert abs(update_data["current_amount"] - update_payload["current_amount"]) < 0.001
        assert update_data["deadline"] == update_payload["deadline"]

        # Retrieve the savings goal to verify progress and deadline
        get_resp = requests.get(
            f"{BASE_URL}/api/savings-goals/{goal_id}",
            headers=HEADERS,
            auth=AUTH,
            timeout=TIMEOUT
        )
        assert get_resp.status_code == 200, f"Unexpected status code on retrieve: {get_resp.status_code}"
        goal_data = get_resp.json()

        # Validate progress calculation: progress = current_amount / target_amount
        target_amt = goal_data.get("target_amount")
        current_amt = goal_data.get("current_amount")
        assert target_amt and target_amt > 0, "Invalid target_amount for savings goal"
        expected_progress = current_amt / target_amt
        progress_reported = goal_data.get("progress")
        assert progress_reported is not None, "Progress field missing in response"
        # Allow small float precision difference
        assert abs(progress_reported - expected_progress) < 0.001, f"Progress calculation incorrect: expected {expected_progress}, got {progress_reported}"

        # Validate deadline is a valid date string and matches updated deadline
        deadline_str = goal_data.get("deadline")
        assert deadline_str == new_deadline_date, f"Deadline mismatch: expected {new_deadline_date}, got {deadline_str}"

        # Delete the savings goal
        delete_resp = requests.delete(
            f"{BASE_URL}/api/savings-goals/{goal_id}",
            headers=HEADERS,
            auth=AUTH,
            timeout=TIMEOUT
        )
        assert delete_resp.status_code == 204, f"Unexpected status code on delete: {delete_resp.status_code}"

        # Verify deletion by attempting to GET - should return 404 or similar
        get_after_delete_resp = requests.get(
            f"{BASE_URL}/api/savings-goals/{goal_id}",
            headers=HEADERS,
            auth=AUTH,
            timeout=TIMEOUT
        )
        assert get_after_delete_resp.status_code == 404, f"Savings goal was not deleted properly, status code: {get_after_delete_resp.status_code}"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    finally:
        # Cleanup if test failed before deletion
        if goal_id is not None:
            try:
                requests.delete(
                    f"{BASE_URL}/api/savings-goals/{goal_id}",
                    headers=HEADERS,
                    auth=AUTH,
                    timeout=TIMEOUT
                )
            except Exception:
                pass


test_savings_goal_management()
