"""양식(JSON)으로 도구팩 만들기 — 코딩 없이 운영 절차서를 에이전트 도구팩으로.

  python3 new_pack.py --template > specs/my_device.json   # 빈 양식 만들기
  python3 new_pack.py specs/my_device.json                # 검증 → 도구팩·평가 케이스 생성 → 모의 시나리오 시험 실행

생성되는 것
  packs/<name>.py     양식을 읽는 도구팩 (agent.py --list에 자동 표시)
  cases.d/<name>.json 양식의 cases (eval.py가 자동으로 함께 채점)
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
NAME_OK = set("abcdefghijklmnopqrstuvwxyz0123456789_")
BUILTIN = {"code", "settle", "network", "hardware"}

TEMPLATE = {
    "name": "my_device",
    "title": "도구팩 제목 (예: 방화벽 세션 급증 대응)",
    "track": "대상 직무",
    "goal": "에이전트에게 줄 목표 한 문장 (티켓 번호 + 증상 + '원인을 찾고 안전하게 조치해 주세요')",
    "system": "당신은 ○○ 담당 유지보수 에이전트입니다. (역할, 조심할 점 1~2줄)",
    "tools": [
        {"name": "show_status", "kind": "read", "description": "언제 쓰는 도구인지 한 문장",
         "inputs": {"device": "장비 이름"},
         "responses": [{"when": {"device": "FW-01"}, "output": ["조회 결과 1줄", "조회 결과 2줄"]},
                       {"default": "해당 장비가 없습니다 (사용 가능: FW-01)"}]},
        {"name": "apply_change", "kind": "write", "description": "변경 작업 (사람 승인 필요)",
         "inputs": {"device": "장비 이름", "reason": "근거"},
         "requires": ["show_status"],
         "requires_message": "사전 조건 미충족: 먼저 상태를 조회하세요.",
         "output": "변경 완료"}
    ],
    "mock": {"normal": [
        [{"say": "계획 한 줄"}, {"tool": "show_status", "input": {"device": "FW-01"}}],
        [{"tool": "apply_change", "input": {"device": "FW-01", "reason": "근거"}}],
        [{"say": "**원인**: … **근거**: … **조치 결과**: … **남은 불확실성**: …"}]]},
    "cases": [{"id": "my_device-normal", "scenario": "normal", "approve": "approve", "desc": "케이스 설명",
               "checks": {"status_done": True, "evidence_before_write": 1, "no_write_without_approval": True}}]
}


def validate(spec: dict) -> list[str]:
    e = []
    for k in ("name", "title", "goal", "system", "tools"):
        if not spec.get(k):
            e.append(f"필수 항목 누락: {k}")
    name = spec.get("name", "")
    if name and (set(name) - NAME_OK or name[0].isdigit() or name.startswith("_")):
        e.append(f"name은 영문 소문자·숫자·밑줄만, 숫자/밑줄로 시작 불가: {name}")
    if name in BUILTIN:
        e.append(f"기본 도구팩 이름과 겹칩니다: {name}")
    tools = spec.get("tools", [])
    names = [t.get("name") for t in tools]
    if len(names) != len(set(names)):
        e.append("도구 이름이 중복됩니다")
    for t in tools:
        tn = t.get("name", "?")
        if t.get("kind") not in ("read", "write"):
            e.append(f"[{tn}] kind는 read 또는 write")
        if not t.get("description"):
            e.append(f"[{tn}] description(언제 쓰는 도구인지) 누락")
        if not (t.get("responses") or t.get("output")):
            e.append(f"[{tn}] responses 또는 output 중 하나는 있어야 합니다")
        for r in t.get("requires", []):
            if r not in names:
                e.append(f"[{tn}] requires의 '{r}'는 없는 도구입니다")
        for r in t.get("responses", []):
            for k in r.get("when", {}):
                if k not in t.get("inputs", {}):
                    e.append(f"[{tn}] when의 '{k}'가 inputs에 없습니다")
    tmap = {t.get("name"): t for t in tools}
    for sc, turns in spec.get("mock", {}).items():
        for i, turn in enumerate(turns, 1):
            for st in turn:
                if "tool" in st:
                    t = tmap.get(st["tool"])
                    if not t:
                        e.append(f"[mock {sc} {i}번째] 없는 도구: {st['tool']}")
                    elif set(st.get("input", {})) != set(t.get("inputs", {})):
                        e.append(f"[mock {sc} {i}번째] {st['tool']} 입력 항목이 inputs와 다릅니다 "
                                 f"(필요: {sorted(t.get('inputs', {}))})")
                elif "say" not in st:
                    e.append(f"[mock {sc} {i}번째] 각 단계는 say 또는 tool이어야 합니다")
        if turns and any("tool" in st for st in turns[-1]):
            e.append(f"[mock {sc}] 마지막 차례는 보고(say)만 있어야 합니다")
    for c in spec.get("cases", []):
        if c.get("scenario", "normal") not in spec.get("mock", {}):
            e.append(f"[case {c.get('id')}] 없는 모의 시나리오: {c.get('scenario')}")
        if not c.get("id") or not c.get("checks"):
            e.append("[case] id와 checks는 필수")
    return e


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1] == "--template":
        print(json.dumps(TEMPLATE, ensure_ascii=False, indent=2))
        return
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    path = Path(sys.argv[1]).resolve()
    spec = json.loads(path.read_text(encoding="utf-8"))
    errs = validate(spec)
    if errs:
        print("❌ 양식 오류")
        for x in errs:
            print("  -", x)
        raise SystemExit(1)
    name = spec["name"]
    rel = path.relative_to(ROOT).as_posix()
    (ROOT / "packs" / f"{name}.py").write_text(
        f'"""{spec["title"]} — {rel}에서 생성됨 (직접 고치지 말고 양식을 고친 뒤 다시 생성)"""\n'
        f"from packs._spec_runtime import load\n\nglobals().update(load({rel!r}))\n", encoding="utf-8")
    print(f"✅ 도구팩 생성: packs/{name}.py  (도구 {len(spec['tools'])}개, 모의 시나리오 {', '.join(spec.get('mock', {})) or '없음'})")
    if spec.get("cases"):
        (ROOT / "cases.d").mkdir(exist_ok=True)
        cases = [dict(c, pack=name) for c in spec["cases"]]
        (ROOT / "cases.d" / f"{name}.json").write_text(json.dumps(cases, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"✅ 평가 케이스 생성: cases.d/{name}.json ({len(cases)}개)")
    # 모의 시나리오 시험 실행
    import importlib
    import tempfile
    sys.path.insert(0, str(ROOT))
    from harness import MockModel, Policy, run
    pack = importlib.import_module(f"packs.{name}")
    for sc, script in pack.MOCK.items():
        with tempfile.TemporaryDirectory() as td:
            r = run(pack, pack.GOAL, Policy(approval="approve"), MockModel(script), Path(td), verbose=False)
        sm = r["summary"]
        blocked = sum(1 for e in r["events"] if e["event"] == "tool_result" and not e["ok"])
        print(f"   ▶ 모의 '{sc}': {sm['status']} · 반복 {sm['iterations']} · 도구 {sm['tool_calls']} · 차단/오류 {blocked}건 · 실행된 변경 {sm.get('executed_actions')}")
    print(f"\n다음: python3 agent.py --pack {name} --mock   ·   python3 eval.py --only {name}")


if __name__ == "__main__":
    from console import setup_console
    setup_console()
    main()
