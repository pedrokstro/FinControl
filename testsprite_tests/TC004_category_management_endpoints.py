import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5000"
AUTH = HTTPBasicAuth("pedrocastro767@gmail.com", "qActive4@#")
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}


def test_category_management_endpoints():
    category_id = None
    try:
        # 1. Create a new category (income or expense) with custom icon, emoji, and color
        create_payload = {
            "name": "Test Category",
            "type": "income",  # or "expense"
            "icon": "wallet",
            "emoji": "4b0",
            "color": "#00FF00"
        }
        response = requests.post(
            f"{BASE_URL}/category",
            json=create_payload,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert response.status_code == 201, f"Create failed: {response.text}"
        category = response.json()
        category_id = category.get("id")
        assert category_id is not None, "No category id returned on create"
        assert category.get("name") == create_payload["name"]
        assert category.get("type") == create_payload["type"]
        assert category.get("icon") == create_payload["icon"]
        assert category.get("emoji") == create_payload["emoji"]
        assert category.get("color") == create_payload["color"]

        # 2. Retrieve the created category by ID
        response = requests.get(
            f"{BASE_URL}/category/{category_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert response.status_code == 200, f"Get by ID failed: {response.text}"
        gotten_category = response.json()
        assert gotten_category["id"] == category_id
        assert gotten_category["name"] == create_payload["name"]
        assert gotten_category["emoji"] == create_payload["emoji"]

        # 3. Update the category's name, icon, emoji, and color
        update_payload = {
            "name": "Updated Category",
            "icon": "piggy-bank",
            "emoji": "437",
            "color": "#FF5733"
        }
        response = requests.put(
            f"{BASE_URL}/category/{category_id}",
            json=update_payload,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert response.status_code == 200, f"Update failed: {response.text}"
        updated_category = response.json()
        assert updated_category["id"] == category_id
        assert updated_category["name"] == update_payload["name"]
        assert updated_category["icon"] == update_payload["icon"]
        assert updated_category["emoji"] == update_payload["emoji"]
        assert updated_category["color"] == update_payload["color"]

        # 4. Retrieve list of all categories and verify the updated category is present
        response = requests.get(
            f"{BASE_URL}/category",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert response.status_code == 200, f"Get list failed: {response.text}"
        categories = response.json()
        assert isinstance(categories, list)
        match = next((c for c in categories if c["id"] == category_id), None)
        assert match is not None, "Updated category not found in list"
        assert match["name"] == update_payload["name"]
        assert match["icon"] == update_payload["icon"]

        # 5. Delete the category
        response = requests.delete(
            f"{BASE_URL}/category/{category_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert response.status_code in (200, 204), f"Delete failed: {response.text}"

        # 6. Verify that the category no longer exists
        response = requests.get(
            f"{BASE_URL}/category/{category_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert response.status_code == 404, "Deleted category still accessible"

    finally:
        # Cleanup in case test failed before deletion
        if category_id is not None:
            try:
                requests.delete(
                    f"{BASE_URL}/category/{category_id}",
                    auth=AUTH,
                    headers=HEADERS,
                    timeout=TIMEOUT,
                )
            except Exception:
                pass


test_category_management_endpoints()