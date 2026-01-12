# Guía de Despliegue en Oracle Cloud (Always Free Tier)

Esta guía te ayudará a desplegar el proyecto **Integración Sentiment** en Oracle Cloud Infrastructure (OCI) usando su capa gratuita permanente.

## 📋 Requisitos Previos
- Cuenta de Oracle Cloud (requiere email y tarjeta de crédito para verificación, pero **no se cobra**)
- Tu repositorio de GitHub actualizado

---

## Paso 1: Crear Cuenta en Oracle Cloud

1. Ve a [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)
2. Haz clic en **"Start for free"**
3. Completa el registro:
   - Email
   - País (selecciona tu país)
   - Nombre de la cuenta (Cloud Account Name)
   - Tarjeta de crédito (solo para verificación, no se cobra)
4. Verifica tu email y espera la activación (puede tardar algunos minutos)

---

## Paso 2: Crear una Instancia de Cómputo (VM)

1. **Inicia sesión** en OCI Console
2. En el menú hamburguesa (☰), ve a **Compute → Instances**
3. Haz clic en **"Create Instance"**
4. Configura la instancia:

### Configuración Recomendada:

**Name:** `sentiment-analysis-vm`

**Image:**
- Selecciona **"Change Image"**
- Elige **"Ubuntu"** (versión 22.04 o superior)

**Shape:**
- Haz clic en **"Change Shape"**
- Selecciona **"Ampere"** (ARM)
- Elige **VM.Standard.A1.Flex**
- Configura:
  - OCPUs: **4**
  - Memory: **24 GB**

**Networking:**
- Mantén la configuración por defecto (creará una VCN automáticamente)
- Asegúrate de que **"Assign a public IPv4 address"** esté marcado

**Add SSH keys:**
- Selecciona **"Generate a key pair for me"**
- Descarga **ambas claves** (privada y pública)
- **IMPORTANTE**: Guarda la clave privada en un lugar seguro

5. Haz clic en **"Create"**
6. Espera a que el estado sea **"Running"** (toma ~2 minutos)
7. **Anota la IP Pública** que aparece en los detalles de la instancia

---

## Paso 3: Configurar Reglas de Firewall

1. En la página de tu instancia, haz clic en la **VCN** (Virtual Cloud Network)
2. Ve a **Security Lists → Default Security List**
3. Haz clic en **"Add Ingress Rules"**
4. Agrega las siguientes reglas (una por una):

### Regla 1: HTTP (Puerto 80)
- **Source CIDR:** `0.0.0.0/0`
- **IP Protocol:** `TCP`
- **Source Port Range:** (dejar vacío)
- **Destination Port Range:** `80`
- **Description:** `Allow HTTP`

### Regla 2: API FastAPI (Puerto 8000)
- **Source CIDR:** `0.0.0.0/0`
- **IP Protocol:** `TCP`
- **Destination Port Range:** `8000`
- **Description:** `Allow FastAPI`

5. Haz clic en **"Add Ingress Rules"** para cada regla

---

## Paso 4: Conectarse a la VM vía SSH

### En Windows (PowerShell):

```powershell
# Navega a la carpeta donde guardaste la clave privada
cd C:\ruta\a\tu\clave

# Conéctate a la VM (reemplaza <IP_PUBLICA> con tu IP)
ssh -i ssh-key-YYYY-MM-DD.key ubuntu@<IP_PUBLICA>
```

### En Linux/Mac (Terminal):

```bash
# Dale permisos a la clave privada
chmod 400 ~/Downloads/ssh-key-YYYY-MM-DD.key

# Conéctate
ssh -i ~/Downloads/ssh-key-YYYY-MM-DD.key ubuntu@<IP_PUBLICA>
```

Si te pregunta "Are you sure you want to continue connecting?", escribe `yes`

---

## Paso 5: Instalar Docker y Docker Compose en la VM

Una vez conectado a la VM, ejecuta los siguientes comandos:

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar tu usuario al grupo docker (para no usar sudo)
sudo usermod -aG docker $USER

# Reiniciar la sesión para aplicar cambios al grupo
exit
```

Vuelve a conectarte con SSH y continúa:

```bash
# Verificar que Docker funciona
docker --version

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar Docker Compose
docker-compose --version
```

---

## Paso 6: Abrir Puertos en el Firewall del Sistema Operativo

Oracle Cloud tiene **dos niveles de firewall**: el de OCI (ya configurado) y el del sistema operativo (Ubuntu).

```bash
# Permitir tráfico HTTP (puerto 80)
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT

# Permitir tráfico en puerto 8000 (FastAPI)
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT

# Guardar las reglas para que persistan después de reiniciar
sudo netfilter-persistent save
```

---

## Paso 7: Clonar el Repositorio y Desplegar

```bash
# Instalar Git si no está instalado
sudo apt install git -y

# Clonar tu repositorio (reemplaza con tu URL)
git clone https://github.com/grupo-10-proyecto-1/Integracion_sentiment.git
cd Integracion_sentiment

# Levantar los servicios con Docker Compose
docker-compose up --build -d
```

El flag `-d` (detached) hace que los contenedores corran en segundo plano.

---

## Paso 8: Verificar el Despliegue

```bash
# Ver el estado de los contenedores
docker ps

# Ver los logs en tiempo real
docker-compose logs -f
```

Para salir de los logs, presiona `Ctrl + C`.

### Acceder a la Aplicación:

Desde tu navegador, ve a:
- **Frontend (UI)**: `http://<IP_PUBLICA>`
- **API FastAPI Docs**: `http://<IP_PUBLICA>:8000/docs`
- **Backend Health**: `http://<IP_PUBLICA>/api/health`

---

## 📊 Comandos Útiles

```bash
# Detener todos los servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver logs de un servicio específico
docker-compose logs sentiment-backend

# Actualizar el código
git pull
docker-compose up --build -d
```

---

## 🔧 Solución de Problemas

### Error: "No se puede conectar vía SSH"
- Verifica que descargaste la clave privada correcta
- Asegúrate de que la instancia esté en estado "Running"
- Revisa que estés usando el usuario correcto: `ubuntu@<IP>`

### Error: "Cannot connect to Docker daemon"
- Ejecuta: `sudo usermod -aG docker $USER` y vuelve a conectarte vía SSH

### La aplicación no responde
- Verifica que los contenedores estén corriendo: `docker ps`
- Revisa los logs: `docker-compose logs`
- Confirma que los puertos 80 y 8000 estén abiertos en ambos firewalls

### Contenedor se detiene inesperadamente
- Revisa los logs: `docker-compose logs sentiment-backend`
- Es posible que falte memoria. Verifica con: `free -h`

---

## 🎯 Próximos Pasos (Opcional)

1. **Configurar un dominio**: Usa servicios gratuitos como [No-IP](https://www.noip.com/) o [DuckDNS](https://www.duckdns.org/) para tener un dominio apuntando a tu IP.
2. **HTTPS con Let's Encrypt**: Configura Certbot para tener certificados SSL gratuitos.
3. **Configurar Auto-Deploy**: Usa GitHub Actions para redesplegar automáticamente cuando hagas push.

---

¡Listo! Ahora tienes tu aplicación corriendo 24/7 de forma gratuita. 🚀
