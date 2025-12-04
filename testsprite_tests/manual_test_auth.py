import requests
import json
import time
import random

BASE_URL = "http://localhost:5000/api/v1"
EMAIL = f"test_manual_{int(time.time())}_{random.randint(1000,9999)}@example.com"
PASSWORD = "Password123!@#"

def print_response(response, name):
    print(f"\n--- {name} ---")
    print(f"Status: {response.status_code}")
    try:
        print("Response:", json.dumps(response.json(), indent=2))
    except:
        print("Response:", response.text)
    return response

def test_auth():
    print(f"Testing API at: {BASE_URL}")
    print(f"Test Email: {EMAIL}")
    
    # 1. Register
    print("\n🔹 1. Registering User...")
    register_data = {
        "name": "Test User Manual",
        "email": EMAIL,
        "password": PASSWORD
    }
    resp = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print_response(resp, "Register")
    
    # 2. Login
    print("\n🔹 2. Logging in...")
    login_data = {
        "email": EMAIL,
        "password": PASSWORD
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print_response(resp, "Login")
    
    if resp.status_code == 200:
        data = resp.json().get("data", {})
        token = data.get("accessToken")
        
        if token:
            print(f"\n✅ Token received: {token[:20]}...")
            headers = {"Authorization": f"Bearer {token}"}
            
            # 3. Get Profile
            print("\n🔹 3. Getting Profile (Token Verification)...")
            resp = requests.get(f"{BASE_URL}/users/me", headers=headers)
            print_response(resp, "Get Profile")
            
            # 4. Update Profile
            print("\n🔹 4. Updating Profile...")
            update_data = {"name": "Test User Updated"}
            resp = requests.put(f"{BASE_URL}/users/me", json=update_data, headers=headers)
            print_response(resp, "Update Profile")
        else:
            print("\n❌ No token in login response")
    else:
        print("\n❌ Login failed")

if __name__ == "__main__":
    test_auth()
