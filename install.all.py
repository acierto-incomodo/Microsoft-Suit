import os
import subprocess

def run_npm_install():
    # Obtiene el directorio raíz donde se encuentra este script
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    for root, dirs, files in os.walk(root_dir):
        # Evitamos entrar en directorios node_modules para no procesar dependencias de dependencias
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
            
        if 'package.json' in files:
            print(f"\n--- Iniciando npm install en: {root} ---")
            try:
                # shell=True es necesario para que Windows reconozca el comando 'npm'
                subprocess.check_call(['npm', 'install'], cwd=root, shell=True)
            except subprocess.CalledProcessError as e:
                print(f"Error procesando {root}: {e}")

if __name__ == "__main__":
    run_npm_install()