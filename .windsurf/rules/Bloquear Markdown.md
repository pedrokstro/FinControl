---
trigger: always_on
---

{
  "id": "block-auto-md",
  "description": "Evita criação automática de arquivos .md",
  "trigger": "file.create",
  "if": {
    "fileExtension": "md",
    "source": "auto"
  },
  "then": [
    {
      "action": "cancel",
      "message": "Criação automática de arquivos .md bloqueada."
    }
  ]
}
