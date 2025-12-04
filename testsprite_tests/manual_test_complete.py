import requests
import json
import time
import random

BASE_URL = "http://localhost:5000/api/v1"
EMAIL = f"test_complete_{int(time.time())}_{random.randint(1000,9999)}@example.com"
PASSWORD = "Password123!@#"

def print_response(response, name):
    print(f"\n{'='*60}")
    print(f"📍 {name}")
    print(f"{'='*60}")
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print("Response:", json.dumps(data, indent=2, ensure_ascii=False))
        return data
    except:
        print("Response:", response.text)
        return None

def print_section(title):
    print(f"\n\n{'#'*60}")
    print(f"# {title}")
    print(f"{'#'*60}\n")

# Variáveis globais para armazenar IDs
token = None
user_id = None
transaction_id = None
category_id = None
goal_id = None

# ============================================================================
# 1. TRANSAÇÕES (Transactions)
# ============================================================================
def test_transactions():
    global token, transaction_id, category_id
    print_section("1️⃣  TESTANDO TRANSAÇÕES")
    
    # Primeiro, precisamos de categorias
    print("\n🔹 Criando categoria para usar nas transações...")
    category_data = {
        "name": "Teste Categoria",
        "type": "expense",
        "icon": "🛒",
        "color": "#FF5733"
    }
    resp = requests.post(f"{BASE_URL}/categories", json=category_data, headers={"Authorization": f"Bearer {token}"})
    data = print_response(resp, "1.0 - Create Category (Setup)")
    if resp.status_code in [200, 201] and data:
        category_id = data.get("data", {}).get("id")
        print(f"✅ Category ID: {category_id}")
    
    # 1.1 - GET Transactions
    print("\n🔹 1.1 - Listando transações...")
    resp = requests.get(f"{BASE_URL}/transactions", headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "1.1 - GET Transactions")
    
    # 1.2 - POST Transaction
    print("\n🔹 1.2 - Criando transação...")
    transaction_data = {
        "type": "expense",
        "amount": 150.50,
        "categoryId": category_id,
        "description": "Teste de transação",
        "date": "2025-11-19"
    }
    resp = requests.post(f"{BASE_URL}/transactions", json=transaction_data, headers={"Authorization": f"Bearer {token}"})
    data = print_response(resp, "1.2 - POST Transaction")
    if resp.status_code in [200, 201] and data:
        transaction_id = data.get("data", {}).get("id")
        print(f"✅ Transaction ID: {transaction_id}")
    
    # 1.3 - PUT Transaction
    if transaction_id:
        print("\n🔹 1.3 - Atualizando transação...")
        update_data = {
            "amount": 200.00,
            "description": "Transação atualizada"
        }
        resp = requests.put(f"{BASE_URL}/transactions/{transaction_id}", json=update_data, headers={"Authorization": f"Bearer {token}"})
        print_response(resp, "1.3 - PUT Transaction")
    
    # 1.4 - DELETE Transaction
    if transaction_id:
        print("\n🔹 1.4 - Deletando transação...")
        resp = requests.delete(f"{BASE_URL}/transactions/{transaction_id}", headers={"Authorization": f"Bearer {token}"})
        print_response(resp, "1.4 - DELETE Transaction")

# ============================================================================
# 2. CATEGORIAS (Categories)
# ============================================================================
def test_categories():
    global token, category_id
    print_section("2️⃣  TESTANDO CATEGORIAS")
    
    # 2.1 - GET Categories
    print("\n🔹 2.1 - Listando categorias...")
    resp = requests.get(f"{BASE_URL}/categories", headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "2.1 - GET Categories")
    
    # 2.2 - POST Category
    print("\n🔹 2.2 - Criando categoria...")
    category_data = {
        "name": "Alimentação Teste",
        "type": "expense",
        "icon": "🍔",
        "color": "#FFA500"
    }
    resp = requests.post(f"{BASE_URL}/categories", json=category_data, headers={"Authorization": f"Bearer {token}"})
    data = print_response(resp, "2.2 - POST Category")
    if resp.status_code in [200, 201] and data:
        category_id = data.get("data", {}).get("id")
        print(f"✅ Category ID: {category_id}")
    
    # 2.3 - PUT Category
    if category_id:
        print("\n🔹 2.3 - Atualizando categoria...")
        update_data = {
            "name": "Alimentação Atualizada",
            "icon": "🍕"
        }
        resp = requests.put(f"{BASE_URL}/categories/{category_id}", json=update_data, headers={"Authorization": f"Bearer {token}"})
        print_response(resp, "2.3 - PUT Category")
    
    # 2.4 - DELETE Category
    if category_id:
        print("\n🔹 2.4 - Deletando categoria...")
        resp = requests.delete(f"{BASE_URL}/categories/{category_id}", headers={"Authorization": f"Bearer {token}"})
        print_response(resp, "2.4 - DELETE Category")

# ============================================================================
# 3. DASHBOARD
# ============================================================================
def test_dashboard():
    global token
    print_section("3️⃣  TESTANDO DASHBOARD")
    
    # 3.1 - GET Dashboard Data
    print("\n🔹 3.1 - Obtendo dados do dashboard...")
    resp = requests.get(f"{BASE_URL}/dashboard", headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "3.1 - GET Dashboard")

# ============================================================================
# 4. SAVINGS GOALS (Metas de Economia)
# ============================================================================
def test_savings_goals():
    global token, goal_id
    print_section("4️⃣  TESTANDO SAVINGS GOALS")
    
    # 4.1 - GET Savings Goals
    print("\n🔹 4.1 - Listando metas...")
    resp = requests.get(f"{BASE_URL}/savings-goals", headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "4.1 - GET Savings Goals")
    
    # 4.2 - POST Savings Goal
    print("\n🔹 4.2 - Criando meta...")
    goal_data = {
        "targetAmount": 15000.00,
        "month": 12,
        "year": 2026,
        "description": "Viagem para Europa"
    }
    resp = requests.post(f"{BASE_URL}/savings-goals", json=goal_data, headers={"Authorization": f"Bearer {token}"})
    data = print_response(resp, "4.2 - POST Savings Goal")
    if resp.status_code in [200, 201] and data:
        goal_id = data.get("data", {}).get("id")
        print(f"✅ Goal ID: {goal_id}")
    
    # 4.3 - PUT Savings Goal
    if goal_id:
        print("\n🔹 4.3 - Atualizando meta...")
        update_data = {
            "targetAmount": 20000.00,
            "month": 6,
            "year": 2027,
            "description": "Viagem Atualizada"
        }
        resp = requests.put(f"{BASE_URL}/savings-goals/{goal_id}", json=update_data, headers={"Authorization": f"Bearer {token}"})
        print_response(resp, "4.3 - PUT Savings Goal")
    
    # 4.4 - DELETE Savings Goal
    if goal_id:
        print("\n🔹 4.4 - Deletando meta...")
        resp = requests.delete(f"{BASE_URL}/savings-goals/{goal_id}", headers={"Authorization": f"Bearer {token}"})
        print_response(resp, "4.4 - DELETE Savings Goal")

# ============================================================================
# 5. SUBSCRIPTION (Assinatura)
# ============================================================================
def test_subscription():
    global token
    print_section("5️⃣  TESTANDO SUBSCRIPTION")
    
    # 5.1 - GET Subscription Status
    print("\n🔹 5.1 - Obtendo status da assinatura...")
    resp = requests.get(f"{BASE_URL}/subscription/status", headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "5.1 - GET Subscription Status")
    
    # 5.2 - GET Features
    print("\n🔹 5.2 - Obtendo features disponíveis...")
    resp = requests.get(f"{BASE_URL}/subscription/features", headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "5.2 - GET Subscription Features")
    
    # 5.3 - POST Activate Premium (1 mês)
    print("\n🔹 5.3 - Ativando plano premium...")
    activate_data = {"durationMonths": 1}
    resp = requests.post(f"{BASE_URL}/subscription/activate", json=activate_data, headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "5.3 - POST Activate Subscription")
    
    # 5.4 - GET Status Again (verificar ativação)
    print("\n🔹 5.4 - Verificando status após ativação...")
    resp = requests.get(f"{BASE_URL}/subscription/status", headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "5.4 - GET Subscription Status (After Activation)")
    
    # 5.5 - POST Cancel
    print("\n🔹 5.5 - Cancelando assinatura...")
    resp = requests.post(f"{BASE_URL}/subscription/cancel", headers={"Authorization": f"Bearer {token}"})
    print_response(resp, "5.5 - POST Cancel Subscription")

# ============================================================================
# SETUP: Autenticação
# ============================================================================
def setup_auth():
    global token, user_id
    print_section("🔐 SETUP - AUTENTICAÇÃO")
    
    print(f"Test Email: {EMAIL}")
    
    # Register
    print("\n🔹 Registrando usuário...")
    register_data = {
        "name": "Test Complete User",
        "email": EMAIL,
        "password": PASSWORD
    }
    resp = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    data = print_response(resp, "Setup - Register")
    
    # Login
    print("\n🔹 Fazendo login...")
    login_data = {
        "email": EMAIL,
        "password": PASSWORD
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    data = print_response(resp, "Setup - Login")
    
    if resp.status_code == 200 and data:
        token = data.get("data", {}).get("accessToken")
        user_data = data.get("data", {}).get("user", {})
        user_id = user_data.get("id")
        print(f"\n✅ Token: {token[:30]}...")
        print(f"✅ User ID: {user_id}")
        return True
    else:
        print("\n❌ Falha na autenticação!")
        return False

# ============================================================================
# MAIN
# ============================================================================
def main():
    print("\n" + "="*60)
    print("🧪 TESTE COMPLETO DA API - FinControl")
    print("="*60)
    
    # Setup
    if not setup_auth():
        return
    
    # Executar testes na ordem
    try:
        test_transactions()      # 1
        test_categories()        # 2
        test_dashboard()         # 3
        test_savings_goals()     # 4
        test_subscription()      # 5
        
        print_section("✅ TODOS OS TESTES CONCLUÍDOS!")
        
    except Exception as e:
        print(f"\n❌ Erro durante os testes: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
