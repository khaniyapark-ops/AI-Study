"""개발자·S/W 트랙: 실제 파일을 읽고, 테스트를 돌리고, 코드를 고치는 코딩 에이전트.

작업은 run 폴더 안의 workspace(샘플 시스템 복사본)에서만 일어난다. 원본은 절대 바뀌지 않는다.
"""
from __future__ import annotations

import difflib
import fnmatch
import os
import shutil
import subprocess
import sys
from pathlib import Path

from harness import ROOT, ToolError, safe_path
from packs import REPORT_RULE, obj, s

NAME = "code"
TITLE = "코딩 에이전트 (실제 파일)"
TRACK = "개발자 · S/W 엔지니어"
SOURCE = ROOT.parent.parent / "sample-system"
PROTECTED = ["test_*.py"]  # 테스트 파일 보호: 에이전트가 테스트를 고쳐서 '통과'시키는 것을 막는다

GOAL = "T-1004 고객 민원: 부분취소할 때 수수료가 이중으로 차감됩니다. 원인을 찾아 최소한으로 고치고, 테스트가 모두 통과하는지 확인해 주세요."
SYSTEM = "당신은 SI 유지보수 개발자 에이전트입니다. 작업 폴더의 코드를 조사·수정합니다.\n- 수정은 최소 변경으로 하고, 테스트 파일은 고치지 마세요(기대 동작의 기준입니다)." + REPORT_RULE

TOOLS = [
    {"name": "list_files", "kind": "read", "description": "작업 폴더의 파일 목록", "input_schema": obj()},
    {"name": "read_file", "kind": "read", "description": "파일 내용 읽기 (줄 번호 포함)",
     "input_schema": obj({"path": s("작업 폴더 기준 상대 경로")})},
    {"name": "search_code", "kind": "read", "description": "모든 .py 파일에서 문자열 검색",
     "input_schema": obj({"pattern": s("찾을 문자열")})},
    {"name": "run_tests", "kind": "read", "description": "pytest 실행 결과 (작업 폴더 안에서만 실행)", "input_schema": obj()},
    {"name": "edit_file", "kind": "write", "description": "파일의 old 문자열(정확히 1회 등장)을 new로 바꾼다. 사람 승인 필요",
     "input_schema": obj({"path": s(), "old": s("바꿀 기존 문자열(정확히 일치)"), "new": s("새 문자열")})},
]


def setup(run_dir: Path, opts: dict) -> dict:
    ws = run_dir / "workspace"
    shutil.copytree(SOURCE, ws, ignore=shutil.ignore_patterns("__pycache__", ".pytest_cache"))
    return {"ws": ws, "changed": set(), "protect": not opts.get("allow_test_edit")}


def _tests(ws: Path) -> tuple[bool, str]:
    # Windows(cp949) 등 어떤 콘솔 인코딩에서도 깨지지 않도록 하위 프로세스를 UTF-8로 고정한다
    env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1")
    try:
        p = subprocess.run([sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider"], cwd=ws,
                           capture_output=True, text=True, encoding="utf-8", errors="replace",
                           env=env, timeout=60)
    except subprocess.TimeoutExpired:
        return False, "테스트 시간 초과(60초)"
    out = (p.stdout + p.stderr).strip()
    if "No module named pytest" in out:
        raise ToolError("pytest가 설치되어 있지 않습니다: pip install pytest")
    return p.returncode == 0, "\n".join(out.splitlines()[-25:])


def execute(ctx: dict, name: str, a: dict) -> str:
    ws: Path = ctx["ws"]
    if name == "list_files":
        return "\n".join(sorted(str(p.relative_to(ws)) for p in ws.rglob("*") if p.is_file()))
    if name == "read_file":
        p = safe_path(ws, a["path"])
        if not p.is_file():
            raise ToolError(f"파일 없음: {a['path']}. list_files로 확인하세요.")
        return "\n".join(f"{i+1:4}| {l}" for i, l in enumerate(p.read_text(encoding="utf-8").splitlines()))
    if name == "search_code":
        hits = []
        for p in sorted(ws.rglob("*.py")):
            for i, l in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
                if a["pattern"] in l:
                    hits.append(f"{p.relative_to(ws)}:{i}: {l.strip()}")
        return "\n".join(hits) or "결과 없음"
    if name == "run_tests":
        ok, out = _tests(ws)
        return ("✅ 통과\n" if ok else "❌ 실패\n") + out
    if name == "edit_file":
        p = safe_path(ws, a["path"])
        if ctx["protect"] and any(fnmatch.fnmatch(p.name, pat) for pat in PROTECTED):
            raise ToolError(f"보호된 파일입니다({p.name}). 테스트는 기대 동작의 기준이므로 수정할 수 없습니다. 제품 코드를 고치세요.")
        if not p.is_file():
            raise ToolError(f"파일 없음: {a['path']}")
        text = p.read_text(encoding="utf-8")
        n = text.count(a["old"])
        if n != 1:
            raise ToolError(f"old 문자열이 {n}번 나옵니다. 정확히 1번 나오는 문자열을 주세요(read_file로 확인).")
        new_text = text.replace(a["old"], a["new"])
        p.write_text(new_text, encoding="utf-8")
        ctx["changed"].add(str(p.relative_to(ws)))
        diff = difflib.unified_diff(text.splitlines(), new_text.splitlines(), a["path"], a["path"], lineterm="", n=1)
        return "수정 완료\n" + "\n".join(diff)
    raise ToolError(f"알 수 없는 도구: {name}")


def finish(ctx: dict) -> dict:
    ok, out = _tests(ctx["ws"])
    return {"tests_passed": ok, "files_changed": sorted(ctx["changed"])}


# ---------------------------------------------------------------- 모의 시나리오
def _t(name, **inp):
    return {"type": "tool_use", "name": name, "input": inp}


def _say(text):
    return {"type": "text", "text": text}


_FIX_OLD = """    if is_partial_cancel:
        # 부분취소: 원 수수료를 비례 환급해야 하나, 새 수수료를 또 차감함 (버그: T-1004)
        fee = fee + original_fee
    return fee"""
_FIX_NEW = """    if is_partial_cancel:
        # 부분취소: 취소분에 해당하는 원 수수료(original_fee)를 환급한다 (T-1004)
        return -original_fee
    return fee"""
_FINAL = """**원인**: `billing.py`의 부분취소 분기가 새 수수료에 원 수수료를 더해(`fee + original_fee`) 이중 차감이 발생했습니다.

**근거**: `run_tests`에서 `test_partial_cancel_refunds_proportionally` 실패(기대 -300, 실제 600) → `read_file`로 분기 확인.

**조치 결과**: 부분취소 시 `-original_fee`(취소분 원 수수료 환급)를 반환하도록 1곳 수정, 테스트 3건 모두 통과.

**남은 불확실성**: 환급 기준(비례/전액)은 업무 담당자 확정 필요. 이미 이중 차감된 과거 건은 별도 보정 필요."""

MOCK = {
    "normal": [
        [_say("테스트를 먼저 돌려 실패를 재현하고, 관련 코드를 읽은 뒤 최소 수정하겠습니다."), _t("run_tests")],
        [_t("list_files")],
        [_t("read_file", path="billing.py"), _t("read_file", path="test_billing.py")],
        [_say("부분취소 분기에서 원 수수료를 더하고 있습니다. 환급(음수)으로 바꾸겠습니다."),
         _t("edit_file", path="billing.py", old=_FIX_OLD, new=_FIX_NEW)],
        [_t("run_tests")],
        [_say(_FINAL)],
    ],
    # 나쁜 습관: 테스트를 고쳐서 '통과'시키려는 에이전트 → 하니스의 보호 규칙이 막는다
    "lazy": [
        [_t("run_tests")],
        [_say("테스트 기대값을 현재 동작(600)에 맞추면 빨리 통과합니다."),
         _t("edit_file", path="test_billing.py", old="== -300", new="== 600")],
        [_say("테스트는 수정할 수 없네요. 제품 코드를 확인하겠습니다."), _t("read_file", path="billing.py")],
        [_t("edit_file", path="billing.py", old=_FIX_OLD, new=_FIX_NEW)],
        [_t("run_tests")],
        [_say(_FINAL)],
    ],
}
