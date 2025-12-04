import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5000"
USERNAME = "pedrocastro767@gmail.com"
PASSWORD = "qActive4@#"
TIMEOUT = 30

def test_subscription_management_endpoints():
    auth = HTTPBasicAuth(USERNAME, PASSWORD)
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    created_subscription_id = None

    try:
        # 1. Retrieve available subscription plans
        plans_resp = requests.get(f"{BASE_URL}/subscriptions/plans", auth=auth, headers=headers, timeout=TIMEOUT)
        assert plans_resp.status_code == 200, f"Expected 200, got {plans_resp.status_code}"
        plans_data = plans_resp.json()
        assert isinstance(plans_data, list), "Plans response should be a list"
        assert len(plans_data) > 0, "There should be at least one subscription plan"

        # Select a premium plan (assuming a plan with a "premium" tier or first plan)
        premium_plan = None
        for plan in plans_data:
            if 'premium' in plan.get('tier', '').lower():
                premium_plan = plan
                break
        if not premium_plan:
            premium_plan = plans_data[0]

        plan_id = premium_plan.get('id')
        assert plan_id is not None, "Selected plan must have an 'id'"

        # 2. Checkout Process - Create subscription checkout session
        checkout_payload = {"planId": plan_id, "paymentMethod": "mock_payment_method"}  # paymentMethod field named generically
        checkout_resp = requests.post(f"{BASE_URL}/subscriptions/checkout", auth=auth, headers=headers, json=checkout_payload, timeout=TIMEOUT)
        assert checkout_resp.status_code == 201 or checkout_resp.status_code == 200, f"Expected 201 or 200, got {checkout_resp.status_code}"
        checkout_data = checkout_resp.json()
        assert 'subscriptionId' in checkout_data or 'id' in checkout_data, "Response must contain subscription identifier"

        created_subscription_id = checkout_data.get('subscriptionId') or checkout_data.get('id')
        assert created_subscription_id is not None, "Subscription ID must be present after checkout"

        # 3. Retrieve subscription details
        detail_resp = requests.get(f"{BASE_URL}/subscriptions/{created_subscription_id}", auth=auth, headers=headers, timeout=TIMEOUT)
        assert detail_resp.status_code == 200, f"Expected 200, got {detail_resp.status_code}"
        detail_data = detail_resp.json()
        assert detail_data.get('id') == created_subscription_id, "Subscription ID mismatch"
        assert detail_data.get('planId') == plan_id, "Plan ID mismatch in subscription detail"

        # 4. List user subscriptions and validate the new subscription is listed
        list_resp = requests.get(f"{BASE_URL}/subscriptions", auth=auth, headers=headers, timeout=TIMEOUT)
        assert list_resp.status_code == 200, f"Expected 200, got {list_resp.status_code}"
        list_data = list_resp.json()
        assert any(s.get('id') == created_subscription_id for s in list_data), "Created subscription should be in subscription list"

        # 5. Update subscription (e.g., change plan to free or another if supported)
        # Find a different plan if possible for update test
        update_plan_id = None
        for plan in plans_data:
            if plan['id'] != plan_id:
                update_plan_id = plan['id']
                break
        if update_plan_id:
            update_payload = {"planId": update_plan_id}
            update_resp = requests.put(f"{BASE_URL}/subscriptions/{created_subscription_id}", auth=auth, headers=headers, json=update_payload, timeout=TIMEOUT)
            assert update_resp.status_code == 200, f"Expected 200 on update, got {update_resp.status_code}"
            updated_data = update_resp.json()
            assert updated_data.get('planId') == update_plan_id, "Plan ID should be updated in subscription"

        # 6. Cancel subscription
        cancel_resp = requests.delete(f"{BASE_URL}/subscriptions/{created_subscription_id}", auth=auth, headers=headers, timeout=TIMEOUT)
        assert cancel_resp.status_code == 204 or cancel_resp.status_code == 200, f"Expected 204 or 200 on delete, got {cancel_resp.status_code}"

        # Validate subscription no longer retrievable
        deleted_resp = requests.get(f"{BASE_URL}/subscriptions/{created_subscription_id}", auth=auth, headers=headers, timeout=TIMEOUT)
        assert deleted_resp.status_code == 404 or deleted_resp.status_code == 410, "Deleted subscription should not be found"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_subscription_management_endpoints()