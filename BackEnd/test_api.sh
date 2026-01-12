#!/bin/bash

# Colores para la terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

URL="http://localhost:8080/sentiment"

echo -e "${GREEN}--- Iniciando Pruebas de API ---${NC}\n"

# 1. Caso: Texto Positivo
echo "1. Probando texto positivo..."
curl -X POST $URL -H "Content-Type: application/json" -d '{"text": "El servicio es excelente y estoy muy feliz"}'
echo -e "\n"

# 2. Caso: Texto Vacío (Debe dar error 400)
echo "2. Probando texto vacío (Validación)..."
curl -v -X POST $URL -H "Content-Type: application/json" -d '{"text": ""}'
echo -e "\n"

# 3. Caso: Texto Muy Largo
echo "3. Probando texto muy largo..."
LONG_TEXT=$(printf 'muy bueno %.0s' {1..100})
curl -X POST $URL -H "Content-Type: application/json" -d "{\"text\": \"$LONG_TEXT\"}"
echo -e "\n"

# 4. Caso: Texto corto
echo "7. Probando texto corto..."
curl -X POST $URL -H "Content-Type: application/json" -d '{"text": "Bueno"}'
echo -e "\n"

# 5. Caso: Texto Neutro
echo "4. Probando texto neutro..."
curl -X POST $URL -H "Content-Type: application/json" -d '{"text": "El cielo es azul."}'
echo -e "\n"

# 6. Caso: Texto Negativo
echo "5. Probando texto negativo..."
curl -X POST $URL -H "Content-Type: application/json" -d '{"text": "Estoy muy decepcionado con el producto"}'
echo -e "\n"

# 7. Caso: Endpoint de Salud
echo "6. Probando endpoint de salud..."
curl -X GET http://localhost:8080/health
echo -e "\n"




echo -e "${GREEN}--- Pruebas Finalizadas ---${NC}"
