import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5000"
AUTH = HTTPBasicAuth('pedrocastro767@gmail.com', 'qActive4@#')
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_transaction_management_endpoints():
    transaction_id = None
    try:
        # 1. Create a transaction
        create_payload = {
            "amount": 150.75,
            "date": "2025-11-14T10:30:00Z",
            "description": "Test transaction creation",
            "category": "Groceries",
            "type": "expense"  # assuming "type" is required: expense or income
        }
        create_resp = requests.post(
            f"{BASE_URL}/transactions",
            json=create_payload,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert create_resp.status_code == 201, f"Create transaction failed: {create_resp.text}"
        created_data = create_resp.json()
        assert "id" in created_data, "Created transaction has no id"
        transaction_id = created_data["id"]
        assert created_data["amount"] == create_payload["amount"]
        assert created_data["description"] == create_payload["description"]
        assert created_data["category"] == create_payload["category"]
        assert created_data["type"] == create_payload["type"]

        # 2. Read transaction by ID
        read_resp = requests.get(
            f"{BASE_URL}/transactions/{transaction_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert read_resp.status_code == 200, f"Read transaction failed: {read_resp.text}"
        read_data = read_resp.json()
        assert read_data["id"] == transaction_id
        assert read_data["amount"] == create_payload["amount"]

        # 3. Update the transaction
        update_payload = {
            "amount": 200.00,
            "description": "Updated transaction description",
            "category": "Health",
            "type": "expense"
        }
        update_resp = requests.put(
            f"{BASE_URL}/transactions/{transaction_id}",
            json=update_payload,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert update_resp.status_code == 200, f"Update transaction failed: {update_resp.text}"
        updated_data = update_resp.json()
        assert updated_data["amount"] == update_payload["amount"]
        assert updated_data["description"] == update_payload["description"]
        assert updated_data["category"] == update_payload["category"]

        # 4. Test filtering transactions - e.g. filter by category "Health"
        filter_params = {
            "category": "Health",
            "page": 1,
            "page_size": 5
        }
        filter_resp = requests.get(
            f"{BASE_URL}/transactions",
            params=filter_params,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert filter_resp.status_code == 200, f"Filter transactions failed: {filter_resp.text}"
        filter_data = filter_resp.json()
        assert "transactions" in filter_data, "Filter response missing 'transactions'"
        assert isinstance(filter_data["transactions"], list), "'transactions' should be a list"
        # Check that returned transactions match the filter parameter category
        for tr in filter_data["transactions"]:
            assert tr["category"] == "Health"

        # 5. Test pagination in listing transactions
        pagination_params = {
            "page": 1,
            "page_size": 2
        }
        page1_resp = requests.get(
            f"{BASE_URL}/transactions",
            params=pagination_params,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert page1_resp.status_code == 200, f"Pagination page 1 failed: {page1_resp.text}"
        page1_data = page1_resp.json()
        assert "transactions" in page1_data
        assert len(page1_data["transactions"]) <= 2

        pagination_params["page"] = 2
        page2_resp = requests.get(
            f"{BASE_URL}/transactions",
            params=pagination_params,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert page2_resp.status_code == 200, f"Pagination page 2 failed: {page2_resp.text}"
        page2_data = page2_resp.json()
        assert "transactions" in page2_data

        # Validate that page1 and page2 transactions are not overlapping by IDs if both have data
        if page1_data["transactions"] and page2_data["transactions"]:
            ids_page1 = set(t["id"] for t in page1_data["transactions"])
            ids_page2 = set(t["id"] for t in page2_data["transactions"])
            assert ids_page1.isdisjoint(ids_page2)

        # 6. Delete the transaction
        delete_resp = requests.delete(
            f"{BASE_URL}/transactions/{transaction_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert delete_resp.status_code == 204, f"Delete transaction failed: {delete_resp.text}"

        # 7. Verify deletion: fetching again should return 404
        get_after_delete_resp = requests.get(
            f"{BASE_URL}/transactions/{transaction_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert get_after_delete_resp.status_code == 404

        transaction_id = None  # Mark as deleted so no cleanup in finally

    finally:
        # Cleanup in case test fails before deletion
        if transaction_id is not None:
            try:
                requests.delete(
                    f"{BASE_URL}/transactions/{transaction_id}",
                    auth=AUTH,
                    headers=HEADERS,
                    timeout=TIMEOUT
                )
            except Exception:
                pass

test_transaction_management_endpoints()