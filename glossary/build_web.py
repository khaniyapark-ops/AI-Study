"""terms.json → 웹용어집.html (데이터를 HTML 안에 넣어 오프라인으로 동작하게 한다).

용어를 고친 뒤:  python3 build_web.py
"""
import json
from pathlib import Path

here = Path(__file__).resolve().parent
data = json.loads((here / "terms.json").read_text(encoding="utf-8"))
html = (here / "web_template.html").read_text(encoding="utf-8")
payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
out = html.replace("/*TERMS_JSON*/null", payload)
(here / "웹용어집.html").write_text(out, encoding="utf-8")
print(f"웹용어집.html 생성: 용어 {len(data['terms'])}개")
