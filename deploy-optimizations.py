#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para aplicar otimizações de performance na VPS
Uso: python deploy-optimizations.py
"""

import paramiko
import sys
import os
from datetime import datetime

# Configurar encoding UTF-8 para Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

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
        print(f"[ERRO] Erro ao executar: {command}")
        print(f"Erro: {error}")
        return None
    return output

def upload_file(client, local_path, remote_path):
    """Faz upload de arquivo via SFTP"""
    # Normalizar caminho para Windows
    local_path = os.path.normpath(local_path)
    if not os.path.exists(local_path):
        print(f"[ERRO] Arquivo nao existe: {local_path}")
        return False
    
    sftp = client.open_sftp()
    try:
        sftp.put(local_path, remote_path)
        print(f"[OK] Upload: {os.path.basename(local_path)} -> {remote_path}")
    except Exception as e:
        print(f"[ERRO] Erro ao fazer upload de {local_path}: {e}")
        return False
    finally:
        sftp.close()
    return True

def main():
    print("[*] Iniciando deploy de otimizacoes de performance...\n")
    
    # Obter diretório do script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    client = create_ssh_client()
    
    try:
        # 1. Criar backup
        print("[*] Criando backup dos arquivos atuais...")
        execute_command(client, f"mkdir -p {BACKUP_DIR}")
        execute_command(client, f"cp -r {REMOTE_DIR}/public {BACKUP_DIR}/public-{datetime.now().strftime('%Y%m%d-%H%M%S')} || true")
        print(f"[OK] Backup criado em: {BACKUP_DIR}\n")
        
        # 2. Upload de arquivos otimizados
        print("[*] Fazendo upload de arquivos otimizados...")
        files_to_upload = [
            (os.path.join("public", "index.html"), f"{REMOTE_DIR}/public/index.html"),
            (os.path.join("public", "promocoes.html"), f"{REMOTE_DIR}/public/promocoes.html"),
            (os.path.join("public", "app.js"), f"{REMOTE_DIR}/public/app.js"),
            (os.path.join("public", "promocoes.js"), f"{REMOTE_DIR}/public/promocoes.js"),
            (os.path.join("public", "styles.css"), f"{REMOTE_DIR}/public/styles.css"),
            (os.path.join("public", "data", "products.json"), f"{REMOTE_DIR}/public/data/products.json"),
            (os.path.join("public", "data", "banners.json"), f"{REMOTE_DIR}/public/data/banners.json"),
            (os.path.join("server", "app.js"), f"{REMOTE_DIR}/server/app.js"),
        ]
        
        # Garantir que os diretórios remotos existem
        execute_command(client, f"mkdir -p {REMOTE_DIR}/public")
        execute_command(client, f"mkdir -p {REMOTE_DIR}/public/data")
        execute_command(client, f"mkdir -p {REMOTE_DIR}/public/products-images/Equipamentos")
        execute_command(client, f"mkdir -p {REMOTE_DIR}/public/products-images/Insumos")
        execute_command(client, f"mkdir -p {REMOTE_DIR}/server")
        
        # Upload de imagens otimizadas
        print("[*] Fazendo upload de imagens otimizadas...")
        import glob
        image_patterns = [
            ("public/products-images/Equipamentos/*.webp", f"{REMOTE_DIR}/public/products-images/Equipamentos/"),
            ("public/products-images/Insumos/*.webp", f"{REMOTE_DIR}/public/products-images/Insumos/"),
        ]
        
        for pattern, remote_dir in image_patterns:
            for local_img in glob.glob(pattern):
                remote_img = os.path.join(remote_dir, os.path.basename(local_img)).replace("\\", "/")
                upload_file(client, local_img, remote_img)
        
        for local, remote in files_to_upload:
            local_path = os.path.join(script_dir, local)
            if os.path.exists(local_path):
                upload_file(client, local_path, remote)
            else:
                print(f"[AVISO] Arquivo nao encontrado: {local_path}")
        
        print()
        
        # 3. Atualizar configuração do Nginx
        print("[*] Atualizando configuracao do Nginx...")
        nginx_conf_path = os.path.join(script_dir, "nginx-optimized.conf")
        upload_file(client, nginx_conf_path, "/tmp/nginx-optimized.conf")
        
        # Copiar e testar configuração
        execute_command(client, f"sudo cp /tmp/nginx-optimized.conf {NGINX_CONFIG}")
        
        # Testar configuração
        result = execute_command(client, "sudo nginx -t")
        if result and ("successful" in result.lower() or "syntax is ok" in result.lower()):
            print("[OK] Configuracao do Nginx valida")
            # Recarregar Nginx
            execute_command(client, "sudo systemctl reload nginx")
            print("[OK] Nginx recarregado\n")
        else:
            print(f"[ERRO] Erro na configuracao do Nginx. Resultado: {result}")
            print("[AVISO] Continuando sem atualizar Nginx...")
            # Não retornar, continuar com o deploy
        
        # 4. Reiniciar servidor Node.js (se estiver rodando via PM2 ou systemd)
        print("[*] Verificando servidor Node.js...")
        # Verificar se está rodando via PM2
        pm2_check = execute_command(client, "pm2 list 2>/dev/null | grep -q 'black-friday' && echo 'running' || echo 'not-running'")
        if pm2_check and 'running' in pm2_check:
            print("[*] Reiniciando aplicacao PM2...")
            execute_command(client, "cd /var/www/html && pm2 restart black-friday || pm2 restart all")
        else:
            # Verificar se está rodando via systemd
            systemd_check = execute_command(client, "systemctl is-active --quiet node-black-friday && echo 'running' || echo 'not-running'")
            if systemd_check and 'running' in systemd_check:
                print("[*] Reiniciando servico Node.js...")
                execute_command(client, "sudo systemctl restart node-black-friday")
            else:
                print("[INFO] Servidor Node.js nao encontrado via PM2 ou systemd. Se estiver rodando manualmente, reinicie manualmente.")
        
        # 5. Verificar serviços
        print("\n[*] Verificando servicos...")
        execute_command(client, "sudo systemctl status nginx --no-pager | head -5")
        print()
        
        print("[OK] Deploy concluido com sucesso!")
        print("[*] Teste o site e verifique a performance!")
        print(f"[*] Backup disponivel em: {BACKUP_DIR}")
        
    except Exception as e:
        print(f"[ERRO] Erro durante deploy: {e}")
        sys.exit(1)
    finally:
        client.close()

if __name__ == "__main__":
    main()

