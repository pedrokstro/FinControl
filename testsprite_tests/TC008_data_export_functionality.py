import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5000"
USERNAME = "pedrocastro767@gmail.com"
PASSWORD = "qActive4@#"
TIMEOUT = 30

def test_data_export_functionality():
    auth = HTTPBasicAuth(USERNAME, PASSWORD)
    export_formats = ["json", "csv", "excel", "pdf"]
    export_endpoint = f"{BASE_URL}/api/export"

    # Define a sample filter payload with only supported fields
    filters = {
        "dateRange": {"start": "2024-01-01", "end": "2024-12-31"}
    }

    for fmt in export_formats:
        try:
            params = {"format": fmt}
            payload = {"filters": filters}
            response = requests.post(
                export_endpoint,
                auth=auth,
                json=payload,
                params=params,
                timeout=TIMEOUT
            )
            assert response.status_code == 200, f"Failed format {fmt}: HTTP {response.status_code}"

            content_type = response.headers.get("Content-Type", "")
            content = response.content
            # Validate content type and content format per export type
            if fmt == "json":
                assert "application/json" in content_type.lower(), f"Expected json content-type for {fmt}, got {content_type}"
                data = response.json()
                assert isinstance(data, (list, dict)), f"JSON export did not return list or dict for {fmt}"
            elif fmt == "csv":
                assert "text/csv" in content_type.lower() or "application/csv" in content_type.lower(), f"Expected csv content-type for {fmt}, got {content_type}"
                text = content.decode('utf-8')
                assert "," in text.splitlines()[0], f"CSV export does not contain expected delimiter for {fmt}"
            elif fmt == "excel":
                # Excel file content-type common values
                assert ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" in content_type.lower()
                        or "application/vnd.ms-excel" in content_type.lower()), f"Expected excel content-type for {fmt}, got {content_type}"
                # Check for xlsx file signature: first 2 bytes should be 'PK' (ZIP file signature)
                assert content[:2] == b'PK', f"Excel export does not appear to be a valid XLSX file for {fmt}"
            elif fmt == "pdf":
                assert "application/pdf" in content_type.lower(), f"Expected pdf content-type for {fmt}, got {content_type}"
                # PDF files start with %PDF
                assert content[:4] == b'%PDF', f"PDF export does not start with %PDF header for {fmt}"
            else:
                assert False, f"Unknown format tested: {fmt}"

        except (requests.RequestException, AssertionError) as e:
            raise AssertionError(f"Test failed for export format '{fmt}': {e}")

test_data_export_functionality()
