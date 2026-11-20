"""에이전트 실행기.

예)
  python3 agent.py --pack settle --mock                 # 키 없이 모의 실행
  python3 agent.py --pack settle                        # 실제 Claude 호출 (승인은 터미널에서 y/N)
  python3 agent.py --pack settle --mock --inject        # 로그에 숨은 지시문(프롬프트 인젝션) 실험
  python3 agent.py --pack code --mock                   # 실제 파일을 고치는 코딩 에이전트
  python3 agent.py --pack network --disable show_transceiver   # 도구를 빼고 실행
  python3 agent.py --list                               # 도구팩 목록
"""
from __future__ import annotations

import argparse
import importlib
import time
import uuid

from harness import ROOT, LiveModel, MockModel, Policy, run

BUILTIN = ["code", "settle", "network", "hardware"]
# packs/ 폴더에 새 파일(예: packs/my_router.py)을 만들면 자동으로 목록에 추가된다
PACKS = BUILTIN + sorted(p.stem for p in (ROOT / "packs").glob("*.py")
                         if p.stem not in BUILTIN and not p.stem.startswith("_"))


def load_pack(name: str):
    return importlib.import_module(f"packs.{name}")


def main() -> None:
    ap = argparse.ArgumentParser(description="유지보수 에이전트 실습 하니스")
    ap.add_argument("--pack", choices=PACKS, help="도구팩(직무)")
    ap.add_argument("--goal", help="목표 문장 (생략 시 도구팩 기본 목표)")
    ap.add_argument("--mock", action="store_true", help="API 없이 모의 실행")
    ap.add_argument("--scenario", default="normal", help="모의 시나리오 이름 (도구팩마다 다름)")
    ap.add_argument("--inject", action="store_true", help="외부 데이터에 숨은 지시문을 심는다")
    ap.add_argument("--approve", choices=["ask", "approve", "deny"], default="ask", help="쓰기 도구 승인 방식")
    ap.add_argument("--max-iter", type=int, default=12)
    ap.add_argument("--disable", nargs="*", default=[], help="뺄 도구 이름")
    ap.add_argument("--effort", default="medium", choices=["low", "medium", "high", "xhigh", "max"])
    ap.add_argument("--allow-test-edit", action="store_true", help="(실험용) code 팩의 테스트 파일 보호 해제")
    ap.add_argument("--mask", action="store_true", help="목표·도구 결과를 모델에 보내기 전에 개인정보 마스킹")
    ap.add_argument("--mask-keep", nargs="*", default=[], help="마스킹에서 뺄 규칙 이름 (예: IP주소)")
    ap.add_argument("--list", action="store_true")
    a = ap.parse_args()

    if a.list or not a.pack:
        for n in PACKS:
            p = load_pack(n)
            print(f"{n:9} {p.TITLE:28} 대상: {p.TRACK}  모의 시나리오: {', '.join(p.MOCK)}")
        return

    pack = load_pack(a.pack)
    scenario = "inject" if a.inject and "inject" in pack.MOCK and a.scenario == "normal" else a.scenario
    if a.mock and scenario not in pack.MOCK:
        raise SystemExit(f"모의 시나리오 '{scenario}' 없음. 사용 가능: {', '.join(pack.MOCK)}")
    model = MockModel(pack.MOCK[scenario]) if a.mock else LiveModel(a.effort)
    policy = Policy(max_iterations=a.max_iter, approval=a.approve, disabled_tools=set(a.disable),
                    mask=a.mask, mask_keep=set(a.mask_keep))
    inject = a.inject or scenario == "inject"
    tag = f"{a.pack}-{scenario if a.mock else 'live'}{'-inject' if inject and scenario != 'inject' else ''}"
    run_dir = ROOT / "runs" / f"{time.strftime('%Y%m%d-%H%M%S')}-{tag}-{uuid.uuid4().hex[:4]}"
    run(pack, a.goal or pack.GOAL, policy, model, run_dir, opts={"inject": inject, "allow_test_edit": a.allow_test_edit})


if __name__ == "__main__":
    from console import setup_console
    setup_console()
    main()
