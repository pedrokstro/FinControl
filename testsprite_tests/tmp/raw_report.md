
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** Controle de Gastos
- **Date:** 11/19/2025
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** authentication system endpoints
- **Test Code:** [TC001_authentication_system_endpoints.py](./TC001_authentication_system_endpoints.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 132, in <module>
  File "<string>", line 38, in test_authentication_system_endpoints
AssertionError: Registration failed: {"success":false,"message":"Rota /api/auth/register não encontrada"}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/3f76bb85-4ba1-40af-b3cd-9369f56c5c33
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** dashboard data retrieval
- **Test Code:** [TC002_dashboard_data_retrieval.py](./TC002_dashboard_data_retrieval.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 66, in <module>
  File "<string>", line 23, in test_dashboard_data_retrieval
AssertionError: Expected status code 200, got 404

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/bcaaaeed-9eb7-4f9d-95b7-f814ee3ece7d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** transaction management endpoints
- **Test Code:** [TC003_transaction_management_endpoints.py](./TC003_transaction_management_endpoints.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 157, in <module>
  File "<string>", line 27, in test_transaction_management_endpoints
AssertionError: Create transaction failed: {"success":false,"message":"Rota /transactions não encontrada"}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/3a303e3e-ae13-4fdf-87c5-dee72f154f99
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** category management endpoints
- **Test Code:** [TC004_category_management_endpoints.py](./TC004_category_management_endpoints.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 120, in <module>
  File "<string>", line 28, in test_category_management_endpoints
AssertionError: Create failed: {"success":false,"message":"Rota /category não encontrada"}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/5eb225e0-501d-4cd8-ab49-f27b5e4b73d4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** financial reports generation
- **Test Code:** [TC005_financial_reports_generation.py](./TC005_financial_reports_generation.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 58, in <module>
  File "<string>", line 17, in test_financial_reports_generation
AssertionError: Chart endpoint status 404

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/c1f6775b-d4cc-4041-aedb-d9bd7b75eaff
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** savings goal management
- **Test Code:** [TC006_savings_goal_management.py](./TC006_savings_goal_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 119, in <module>
  File "<string>", line 28, in test_savings_goal_management
AssertionError: Unexpected status code on creation: 404

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/8da6f05c-eb02-49e0-9876-8faafe6a8341
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** user settings management
- **Test Code:** [TC007_user_settings_management.py](./TC007_user_settings_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 80, in <module>
  File "<string>", line 18, in test_user_settings_management
AssertionError

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/6b3db0cd-2f39-4587-a509-41319e0d5f26
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** data export functionality
- **Test Code:** [TC008_data_export_functionality.py](./TC008_data_export_functionality.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 30, in test_data_export_functionality
AssertionError: Failed format json: HTTP 404

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 59, in <module>
  File "<string>", line 57, in test_data_export_functionality
AssertionError: Test failed for export format 'json': Failed format json: HTTP 404

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/e25f0a0c-69e0-4407-966c-a469d4243843
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** account deletion process
- **Test Code:** [TC009_account_deletion_process.py](./TC009_account_deletion_process.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 49, in <module>
  File "<string>", line 22, in test_account_deletion_process
AssertionError: OTP request failed: {"success":false,"message":"Rota /account/deletion/request-otp não encontrada"}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/a7514545-54f1-4192-9d39-9c624f700d25
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** subscription management endpoints
- **Test Code:** [TC010_subscription_management_endpoints.py](./TC010_subscription_management_endpoints.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 86, in <module>
  File "<string>", line 21, in test_subscription_management_endpoints
AssertionError: Expected 200, got 404

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5ac1ae00-83f1-4657-a128-0c1fc6abec4d/2e5cb729-84b1-4e74-96e6-853a0754b648
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---