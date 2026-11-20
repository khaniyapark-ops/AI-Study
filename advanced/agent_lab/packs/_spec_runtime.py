"""양식(JSON) 기반 도구팩 실행기. new_pack.py가 만든 packs/<이름>.py가 이 모듈을 불러 쓴다.

양식 형식은 specs/_template.json 참고.
"""
from __future__ import annotations

import json
from pathlib import Path

from harness import ROOT, ToolError
from packs import REPORT_RULE, obj, s


def _schema(inputs: dict) -> dict:
    return obj({k: s(v.get("desc", "")) if isinstance(v, dict) else s(v) for k, v in inputs.items()} if inputs else {})


def _match(when: dict, args: dict) -> bool:
    for k, v in when.items():
        if str(v).lower() not in str(args.get(k, "")).lower():
            return False
    return True


def load(spec_path: str) -> dict:
    spec = json.loads((ROOT / spec_path).read_text(encoding="utf-8"))
    tools = {t["name"]: t for t in spec["tools"]}

    def setup(run_dir: Path, opts: dict) -> dict:
        return {"done": [], "actions": []}

    def precheck(ctx: dict, name: str, a: dict) -> None:
        """도메인 사전 조건. 하니스가 승인 요청 전에 부른다 — 어차피 막힐 조치로 승인자를 깨우지 않는다."""
        t = tools.get(name)
        if t is None:
            raise ToolError(f"알 수 없는 도구: {name}")
        missing = [r for r in t.get("requires", []) if r not in ctx["done"]]
        if missing:
            raise ToolError(t.get("requires_message") or f"사전 조건 미충족: 먼저 {', '.join(missing)}을(를) 실행해 확인하세요.")

    def execute(ctx: dict, name: str, a: dict) -> str:
        precheck(ctx, name, a)  # 직접 호출되는 경우에도 지킨다
        t = tools[name]
        out = None
        for r in t.get("responses", []):
            if "when" in r and _match(r["when"], a):
                out = r["output"]
                break
        if out is None:
            out = next((r["default"] for r in t.get("responses", []) if "default" in r), t.get("output"))
        if out is None:
            raise ToolError(t.get("no_match_message") or f"해당 조건의 결과가 없습니다. 입력값을 확인하세요: {json.dumps(a, ensure_ascii=False)}")
        if isinstance(out, list):
            out = "\n".join(out)
        ctx["done"].append(name)
        if t["kind"] == "write":
            ctx["actions"].append(name)
            out = f"(시뮬레이션) {out}"
        return out

    def finish(ctx: dict) -> dict:
        return {"executed_actions": ctx["actions"]}

    def conv(step: dict) -> dict:
        if "say" in step:
            return {"type": "text", "text": "\n".join(step["say"]) if isinstance(step["say"], list) else step["say"]}
        return {"type": "tool_use", "name": step["tool"], "input": step.get("input", {})}

    return {
        "NAME": spec["name"], "TITLE": spec["title"], "TRACK": spec.get("track", ""),
        "GOAL": spec["goal"], "SYSTEM": spec["system"] + REPORT_RULE,
        "TOOLS": [{"name": t["name"], "kind": t["kind"], "description": t["description"],
                   "input_schema": _schema(t.get("inputs", {}))} for t in spec["tools"]],
        "MOCK": {k: [[conv(st) for st in turn] for turn in v] for k, v in spec.get("mock", {}).items()},
        "setup": setup, "precheck": precheck, "execute": execute, "finish": finish,
    }
