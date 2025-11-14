#!/usr/bin/env python3
"""
Script para aplicar otimizações na VPS via SSH
Usa ssh_run.py para executar comandos remotamente
"""

import subprocess
import sys
import os

def run_ssh_command(command):
    """Executa comando via SSH usando ssh_run.py"""
    try:
        result = subprocess.run(
            ["python", "ssh_run.py"] + command.split(),
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar comando: {command}")
        print(f"Erro: {e.stderr}")
        return None, e.stderr

def upload_file(local_path, remote_path):
    """Upload de arquivo via SCP"""
    try:
        # Usar scp para upload
        from paramiko import SSHClient, AutoAddPolicy
        import paramiko
        
        HOST = "72.60.150.75"
        USER = "root"
        PASSWORD = "-yh\'W(V;DCUH@sgW&5N8"
        
        client = SSHClient()
        client.set_missing_host_key_policy(AutoAddPolicy())
        client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=60)
        
        sftp = client.open_sftp()
        sftp.put(local_path, remote_path)
        sftp.close()
        client.close()
        
        print(f"✅ Arquivo {local_path} enviado para {remote_path}")
        return True
    except Exception as e:
        print(f"❌ Erro ao fazer upload: {e}")
        return False

def main():
    print("🚀 Iniciando otimizações da VPS...")
    print("=" * 50)
    
    # 1. Verificar se os arquivos necessários existem
    if not os.path.exists("nginx-optimized.conf"):
        print("❌ Arquivo nginx-optimized.conf não encontrado!")
        sys.exit(1)
    
    if not os.path.exists("vps-optimize.sh"):
        print("❌ Arquivo vps-optimize.sh não encontrado!")
        sys.exit(1)
    
    # 2. Upload dos arquivos de configuração
    print("\n📤 Enviando arquivos para a VPS...")
    upload_file("nginx-optimized.conf", "/tmp/nginx-optimized.conf")
    upload_file("vps-optimize.sh", "/tmp/vps-optimize.sh")
    
    # 3. Tornar script executável
    print("\n🔧 Configurando permissões...")
    stdout, stderr = run_ssh_command("chmod +x /tmp/vps-optimize.sh")
    if stdout:
        print(stdout)
    
    # 4. Executar script de otimização
    print("\n⚙️ Executando otimizações...")
    stdout, stderr = run_ssh_command("bash /tmp/vps-optimize.sh")
    if stdout:
        print(stdout)
    if stderr:
        print(f"Avisos: {stderr}")
    
    # 5. Aplicar configuração do Nginx
    print("\n🌐 Aplicando configuração do Nginx...")
    
    # Backup da configuração atual
    run_ssh_command("cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true")
    
    # Copiar nova configuração (ajustar server_name conforme necessário)
    run_ssh_command("cp /tmp/nginx-optimized.conf /etc/nginx/sites-available/blackfriday-rzvet")
    
    # Criar link simbólico
    run_ssh_command("ln -sf /etc/nginx/sites-available/blackfriday-rzvet /etc/nginx/sites-enabled/blackfriday-rzvet")
    
    # Testar configuração
    print("\n🧪 Testando configuração do Nginx...")
    stdout, stderr = run_ssh_command("nginx -t")
    if stdout:
        print(stdout)
    if "successful" in stdout or "test is successful" in stdout:
        print("✅ Configuração válida!")
        
        # Reiniciar Nginx
        print("\n🔄 Reiniciando Nginx...")
        stdout, stderr = run_ssh_command("systemctl restart nginx")
        if stdout:
            print(stdout)
        
        # Verificar status
        print("\n📊 Status do Nginx:")
        stdout, stderr = run_ssh_command("systemctl status nginx --no-pager -l")
        if stdout:
            print(stdout)
    else:
        print("❌ Erro na configuração do Nginx!")
        if stderr:
            print(stderr)
        print("\n⚠️ Restaurando backup...")
        run_ssh_command("rm -f /etc/nginx/sites-enabled/blackfriday-rzvet")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✅ Otimizações aplicadas com sucesso!")
    print("\n📋 Verificações recomendadas:")
    print("1. Verificar logs: tail -f /var/log/nginx/error.log")
    print("2. Testar site: curl -I http://seu-dominio.com")
    print("3. Verificar compressão: curl -H 'Accept-Encoding: gzip' -I http://seu-dominio.com")

if __name__ == "__main__":
    main()


