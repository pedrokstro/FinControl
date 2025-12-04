import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5000"
USERNAME = "pedrocastro767@gmail.com"
PASSWORD = "qActive4@#"
TIMEOUT = 30

def test_financial_reports_generation():
    auth = HTTPBasicAuth(USERNAME, PASSWORD)
    headers = {"Accept": "application/json"}

    # 1. Test chart data generation endpoint
    chart_url = f"{BASE_URL}/api/reports/chart"
    try:
        resp_chart = requests.get(chart_url, auth=auth, headers=headers, timeout=TIMEOUT)
        assert resp_chart.status_code == 200, f"Chart endpoint status {resp_chart.status_code}"
        chart_data = resp_chart.json()
        assert isinstance(chart_data, dict), "Chart response is not a dict"
        # Validate presence of expected chart types and data format
        for chart_type in ("income_trends", "expense_trends", "category_breakdown"):
            assert chart_type in chart_data, f"Missing chart type '{chart_type}' in chart data"
            assert isinstance(chart_data[chart_type], list), f"Chart data for '{chart_type}' not a list"
            # Each item in the list should be a dict with at least 'label' and 'value'
            for item in chart_data[chart_type]:
                assert isinstance(item, dict), f"Chart item in '{chart_type}' not a dict"
                assert "label" in item and "value" in item, f"Chart item in '{chart_type}' missing 'label' or 'value'"
    except requests.RequestException as e:
        assert False, f"Chart request failed: {e}"

    # 2. Test export functionality for multiple formats
    export_formats = ["json", "csv", "excel", "pdf"]
    export_url = f"{BASE_URL}/api/reports/export"
    for fmt in export_formats:
        params = {"format": fmt}
        try:
            resp_export = requests.get(export_url, auth=auth, headers=headers, params=params, timeout=TIMEOUT)
            assert resp_export.status_code == 200, f"Export {fmt} endpoint status {resp_export.status_code}"
            content_type = resp_export.headers.get("Content-Type", "")
            # Validate content type by format
            if fmt == "json":
                assert "application/json" in content_type, f"Unexpected content-type for json export: {content_type}"
                data = resp_export.json()  # Should parse without error
                assert isinstance(data, list) or isinstance(data, dict), "Exported JSON data structure unexpected"
            elif fmt == "csv":
                assert "text/csv" in content_type or "application/csv" in content_type, f"Unexpected content-type for csv: {content_type}"
                assert resp_export.text.startswith(("Date", "date", "Transaction", "transaction")), "CSV export content likely invalid"
            elif fmt == "excel":
                assert "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" in content_type or \
                       "application/vnd.ms-excel" in content_type, f"Unexpected content-type for excel: {content_type}"
                assert len(resp_export.content) > 0, "Excel export file is empty"
            elif fmt == "pdf":
                assert "application/pdf" in content_type, f"Unexpected content-type for pdf: {content_type}"
                assert len(resp_export.content) > 0, "PDF export file is empty"
        except requests.RequestException as e:
            assert False, f"Export {fmt} request failed: {e}"

test_financial_reports_generation()
