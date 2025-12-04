import requests
from requests.auth import HTTPBasicAuth
import time

def test_dashboard_data_retrieval():
    base_url = "http://localhost:5000"
    endpoint = f"{base_url}/api/dashboard"
    auth = HTTPBasicAuth("pedrocastro767@gmail.com", "qActive4@#")
    headers = {
        "Accept": "application/json",
    }
    timeout = 30

    start_time = time.time()
    try:
        response = requests.get(endpoint, auth=auth, headers=headers, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"Request to dashboard endpoint failed: {e}"

    elapsed_time = time.time() - start_time

    # Assert on response status
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    # Validate response JSON structure and content
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate presence of main dashboard keys
    expected_keys = ["financialOverview", "chartsData", "recentTransactions", "quickActions"]
    for key in expected_keys:
        assert key in data, f"Key '{key}' missing in dashboard response"

    # Validate financial overview content (basic checks)
    financial_overview = data["financialOverview"]
    assert isinstance(financial_overview, dict), "'financialOverview' should be a dictionary"
    # Example checks for balance, income, expense fields presence
    for field in ["balance", "totalIncome", "totalExpense"]:
        assert field in financial_overview, f"'{field}' missing in financialOverview"
        assert isinstance(financial_overview[field], (int, float)), f"'{field}' should be numeric"

    # Validate chartsData - expecting dict or list (depends on implementation)
    charts_data = data["chartsData"]
    assert charts_data is not None, "'chartsData' should not be None"

    # Validate recentTransactions - expecting list, allow empty but ensure type
    recent_transactions = data["recentTransactions"]
    assert isinstance(recent_transactions, list), "'recentTransactions' should be a list"
    # If there are transactions, check the first item for expected keys
    if recent_transactions:
        sample_tx = recent_transactions[0]
        assert isinstance(sample_tx, dict), "Each item in 'recentTransactions' should be a dict"
        tx_expected_keys = ["id", "date", "category", "amount", "type", "description"]
        for key in tx_expected_keys:
            assert key in sample_tx, f"Transaction item missing key '{key}'"

    # Validate quickActions - expecting list or dict (check at least existence)
    quick_actions = data["quickActions"]
    assert quick_actions is not None, "'quickActions' should not be None"

    # Validate performance: response time should be reasonable (under 3 seconds)
    assert elapsed_time <= 3, f"Dashboard API response time too high: {elapsed_time:.2f}s"

test_dashboard_data_retrieval()