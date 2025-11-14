#!/usr/bin/env python3
"""
Script para aplicar otimizações de performance na VPS
Uso: python deploy-optimizations.py
"""

import paramiko
import sys
import os
from datetime import datetime

HOST = "72.60.150.75"
USER = "root"
PASSWORD = "-yh\'W(V;DCUH@sgW&5N8"
REMOTE_DIR = "/var/www/html"
NGINX_CONFIG = "/etc/nginx/sites-available/default"
BACKUP_DIR = f"{REMOTE_DIR}/backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

def create_ssh_client():
    """Cria e conecta cliente SSH"""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=60)
    return client

def execute_command(client, command):
    """Executa comando remoto e retorna resultado"""
    stdin, stdout, stderr = client.exec_command(command)
    exit_status = stdout.channel.recv_exit_status()
    output = stdout.read().decode('utf-8')
    error = stderr.read().decode('utf-8')
    if exit_status != 0:
        print(f"❌ Erro ao executar: {command}")
        print(f"Erro: {error}")
        return None
    return output

def upload_file(client, local_path, remote_path):
    """Faz upload de arquivo via SFTP"""
    sftp = client.open_sftp()
    try:
        sftp.put(local_path, remote_path)
        print(f"✅ Upload: {local_path} -> {remote_path}")
    except Exception as e:
        print(f"❌ Erro ao fazer upload de {local_path}: {e}")
        return False
    finally:
        sftp.close()
    return True

def main():
    print("🚀 Iniciando deploy de otimizações de performance...\n")
    
    client = create_ssh_client()
    
    try:
        # 1. Criar backup
        print("📦 Criando backup dos arquivos atuais...")
        execute_command(client, f"mkdir -p {BACKUP_DIR}")
        execute_command(client, f"cp -r {REMOTE_DIR}/public {BACKUP_DIR}/public-{datetime.now().strftime('%Y%m%d-%H%M%S')} || true")
        print(f"✅ Backup criado em: {BACKUP_DIR}\n")
        
        # 2. Upload de arquivos otimizados
        print("📤 Fazendo upload de arquivos otimizados...")
        files_to_upload = [
            ("public/index.html", f"{REMOTE_DIR}/public/index.html"),
            ("public/promocoes.html", f"{REMOTE_DIR}/public/promocoes.html"),
            ("public/app.js", f"{REMOTE_DIR}/public/app.js"),
            ("public/promocoes.js", f"{REMOTE_DIR}/public/promocoes.js"),
            ("public/styles.css", f"{REMOTE_DIR}/public/styles.css"),
            ("server/app.js", f"{REMOTE_DIR}/server/app.js"),
        ]
        
        for local, remote in files_to_upload:
            if os.path.exists(local):
                upload_file(client, local, remote)
            else:
                print(f"⚠️  Arquivo não encontrado: {local}")
        
        print()
        
        # 3. Atualizar configuração do Nginx
        print("⚙️  Atualizando configuração do Nginx...")
        upload_file(client, "nginx-optimized.conf", "/tmp/nginx-optimized.conf")
        
        # Copiar e testar configuração
        execute_command(client, f"sudo cp /tmp/nginx-optimized.conf {NGINX_CONFIG}")
        
        # Testar configuração
        result = execute_command(client, "sudo nginx -t")
        if result and "successful" in result.lower():
            print("✅ Configuração do Nginx válida")
            # Recarregar Nginx
            execute_command(client, "sudo systemctl reload nginx")
            print("✅ Nginx recarregado\n")
        else:
            print("❌ Erro na configuração do Nginx. Verifique manualmente.")
            return
        
        # 4. Reiniciar servidor Node.js (se estiver rodando via PM2 ou systemd)
        print("🔄 Verificando servidor Node.js...")
        # Verificar se está rodando via PM2
        pm2_check = execute_command(client, "pm2 list 2>/dev/null | grep -q 'black-friday' && echo 'running' || echo 'not-running'")
        if pm2_check and 'running' in pm2_check:
            print("🔄 Reiniciando aplicação PM2...")
            execute_command(client, "cd /var/www/html && pm2 restart black-friday || pm2 restart all")
        else:
            # Verificar se está rodando via systemd
            systemd_check = execute_command(client, "systemctl is-active --quiet node-black-friday && echo 'running' || echo 'not-running'")
            if systemd_check and 'running' in systemd_check:
                print("🔄 Reiniciando serviço Node.js...")
                execute_command(client, "sudo systemctl restart node-black-friday")
            else:
                print("ℹ️  Servidor Node.js não encontrado via PM2 ou systemd. Se estiver rodando manualmente, reinicie manualmente.")
        
        # 5. Verificar serviços
        print("\n✅ Verificando serviços...")
        execute_command(client, "sudo systemctl status nginx --no-pager | head -5")
        print()
        
        print("✨ Deploy concluído com sucesso!")
        print("🌐 Teste o site e verifique a performance!")
        print(f"📦 Backup disponível em: {BACKUP_DIR}")
        
    except Exception as e:
        print(f"❌ Erro durante deploy: {e}")
        sys.exit(1)
    finally:
        client.close()

if __name__ == "__main__":
    main()

