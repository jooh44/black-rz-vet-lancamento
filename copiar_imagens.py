import shutil
from pathlib import Path

# Caminhos
src_equip = Path(r"C:\Users\Administrador\Downloads\products-images\Equipamentos")
src_insum = Path(r"C:\Users\Administrador\Downloads\products-images\Insumos")
dest_equip = Path("public/valores-black")
dest_insum = Path("public/valores-black/acessorios")

# Criar pastas
dest_equip.mkdir(parents=True, exist_ok=True)
dest_insum.mkdir(parents=True, exist_ok=True)

# Mapeamento
equipamentos = {
    "RM1200.webp": "monitor-rm1200.webp",
    "RM700.webp": "monitor-rm-700.webp",
    "RE700.webp": "monitor-re700.webp",
    "R1000.webp": "monitor-portatil-r1000.webp",
    "R200.webp": "monitor-portatil-r200.webp",
    "M200A.webp": "bomba-de-seringa-m200a.webp",
    "KIT M200 A WORK.webp": "kit-4-bomba-de-seringa.webp",
    "NEUROSTIM.webp": "neurostim.webp",
    "OXIMETRO.webp": "oximetro.webp",
}

insumos = {
    "AGULHA TUOHY 16 18.webp": "agulha-tuohy-16g-18g-90mm.webp",
    "AGULHA TUOHY 17.webp": "agulha-tuohy-17g-90mm.webp",
    "AGULHA TUOHY 20X50G.webp": "agulha-tuohy-20g-50mm.webp",
    "AGULHA TUOHY 20X90G.webp": "agulha-tuohy-20g-90mm.webp",
    "AGULHA TUOHY 22X50G.webp": "agulha-tuohy-22g-50mm.webp",
    "AGULHA BLOQUEIO 100MM.webp": "agulha-bloqueio-periferico-21g-100mm.webp",
    "AGULHA BLOQUEIO 50MM.webp": "agulha-bloqueio-periferico-22g-50mm.webp",
    "multi injetor 3.webp": "multi-injetor-linear-3-aplicadores.webp",
    "BALAO 250ML.webp": "balao-latex-reinalacao-250ml.webp",
    "BALAO 500ML.webp": "balao-latex-reinalacao-500ml.webp",
    "BALAO 1 , 2 ,3.webp": "balao-latex-reinalacao-1litro.webp",
    "AMBU.webp": "reanimador-manual-ambu.webp",
    "CABO ECG 3 VIAS.webp": "kit-cabo-ecg-03-vias-03-garras.webp",
    "CANULA GATO.webp": "canula-gato-no03-3-5kg.webp",
    "CANULA COELHO.webp": "canula-coelho-no02-no03.webp",
    "ATADURAS 5 CM.webp": "atadura-elastica-5cm.webp",
    "ATADURAS 10 CM.webp": "atadura-elastica-10cm.webp",
    "cateter venoso.webp": "cateter-venoso-central-4fr-5fr.webp",
}

print("Copiando equipamentos...")
for src_name, dest_name in equipamentos.items():
    src = src_equip / src_name
    dest = dest_equip / dest_name
    if src.exists():
        shutil.copy2(src, dest)
        print(f"  ✓ {dest_name}")
    else:
        print(f"  ✗ {src_name} não encontrado")

print("\nCopiando insumos...")
for src_name, dest_name in insumos.items():
    src = src_insum / src_name
    dest = dest_insum / dest_name
    if src.exists():
        shutil.copy2(src, dest)
        print(f"  ✓ {dest_name}")
    else:
        print(f"  ✗ {src_name} não encontrado")

print("\n✓ Concluído!")






