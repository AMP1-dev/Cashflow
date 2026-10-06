import urllib.request
import ssl

ctx = ssl.create_default_context()
r = urllib.request.urlopen('https://jmartins.ind.br', context=ctx).read().decode('utf-8')

print("--- VERIFYING LIVE MENU ---")
for item in ['Produtos', 'Cotação', 'Fábrica', 'Entregas', 'Informativo']:
    assert f'>{item}<' in r, f"Menu item {item} missing!"
    print(f"Item '{item}': OK")

# Check navbar button
header_part = r.split('<header')[1].split('</header>')[0]
buttons_part = header_part.split('<!-- BOTÕES DE AÇÃO -->')[1]
assert 'Painel Adm</span>\n        </button>' not in buttons_part, "Painel Adm button still in navbar buttons!"
print("Botão 'Painel Adm' removido da barra principal: OK")

# Check topbar retains access
assert 'Área Adm' in r, "Área Adm missing from topbar!"
print("Acesso administrativo mantido na topbar (Área Adm): OK")

print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
