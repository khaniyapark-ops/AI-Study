"""H/W 엔지니어 트랙: DB 서버 디스크·RAID·전원 이상 대응 에이전트 (가상 장비)."""
from __future__ import annotations

from pathlib import Path

from harness import ToolError
from packs import REPORT_RULE, obj, s

NAME = "hardware"
TITLE = "서버 H/W 장애 대응 (시뮬레이션)"
TRACK = "H/W 엔지니어 · 운영자"
GOAL = "DB-PRD-03에서 디스크 예측 장애와 RAID 저하 알람이 왔습니다. 위험도를 판단하고 데이터 보호를 우선해 조치를 진행해 주세요."
SYSTEM = ("당신은 서버 H/W 유지보수 에이전트입니다. 관리 콘솔 조회로 상태를 확인하고, 작업 지시·재구성은 변경 도구로 요청합니다.\n"
          "- 데이터 보호가 최우선입니다. 백업 확인 전 위험 작업은 하지 마세요." + REPORT_RULE)

TOOLS = [
    {"name": "get_sel", "kind": "read", "description": "시스템 이벤트 로그(iDRAC SEL)", "input_schema": obj({"server": s()})},
    {"name": "get_raid_status", "kind": "read", "description": "RAID 가상 디스크 상태", "input_schema": obj({"server": s()})},
    {"name": "get_smart", "kind": "read", "description": "디스크 SMART 값", "input_schema": obj({"server": s(), "disk": s("예: sdd")})},
    {"name": "get_psu_status", "kind": "read", "description": "전원 공급 장치 상태", "input_schema": obj({"server": s()})},
    {"name": "check_backup", "kind": "read", "description": "최근 백업·복제 상태", "input_schema": obj({"server": s()})},
    {"name": "get_spare_inventory", "kind": "read", "description": "예비 부품 재고", "input_schema": obj()},
    {"name": "create_work_order", "kind": "write", "description": "현장 작업 지시 생성(부품 교체 등). 사람 승인 필요",
     "input_schema": obj({"server": s(), "task": s(), "window": s("작업 시간대")})},
    {"name": "start_raid_rebuild", "kind": "write", "description": "디스크 교체 후 RAID 재구성 시작. 사람 승인 필요",
     "input_schema": obj({"server": s(), "reason": s()})},
]


def setup(run_dir: Path, opts: dict) -> dict:
    return {"backup_checked": False, "replaced": False, "orders": [], "rebuild": False}


def execute(ctx: dict, name: str, a: dict) -> str:
    if name != "get_spare_inventory" and a.get("server") != "DB-PRD-03":
        raise ToolError(f"서버 없음: {a.get('server')}. 사용 가능: DB-PRD-03")
    if name == "get_sel":
        return ("11-14 22:41:05 Drive 3 Bay 3: Predictive failure (SMART)\n11-14 22:41:09 Virtual Disk 0 (RAID5): Degraded\n"
                "11-15 01:12:44 PSU 2: AC lost, redundancy lost\n11-15 01:13:10 PSU 2: AC restored")
    if name == "get_raid_status":
        return "VD0 RAID5 (4 disks) State: Degraded  Failed/Predictive: Drive 3 (sdd)  ← 1개 더 고장 시 데이터 손실"
    if name == "get_smart":
        if a["disk"] == "sdd":
            return "Reallocated_Sector_Ct=312  Current_Pending_Sector=48 (1주 전 12)  Power_On_Hours=41200  ← 불량 진행 중"
        return f"{a['disk']}: Reallocated_Sector_Ct=0  Current_Pending_Sector=0  (정상)"
    if name == "get_psu_status":
        return "PSU1 OK · PSU2 OK (01:12~01:13 AC 단절 1회, 원인 미상 — PDU B 포트 점검 권장)"
    if name == "check_backup":
        ctx["backup_checked"] = True
        return "최근 전체 백업: 11-15 03:00 성공 (검증 완료) · 복제(DB-DR-01) 지연 3초 정상"
    if name == "get_spare_inventory":
        return "1.92TB SAS SSD(동일 모델) 2개 · PSU 1개"
    if name == "create_work_order":
        ctx["orders"].append(a)
        if "디스크" in a["task"] or "drive" in a["task"].lower():
            ctx["replaced"] = True
        return f"(시뮬레이션) 작업 지시 WO-{4400 + len(ctx['orders'])} 생성: {a['task']} / {a['window']}"
    if name == "start_raid_rebuild":
        # 도메인 가드레일: 도구 자체가 사전 조건을 검사한다 (모델 판단에만 맡기지 않는다)
        if not ctx["backup_checked"]:
            raise ToolError("사전 조건 미충족: 백업 상태를 먼저 확인해야 합니다(check_backup).")
        if not ctx["replaced"]:
            raise ToolError("사전 조건 미충족: 디스크 교체 작업 지시가 먼저 필요합니다.")
        ctx["rebuild"] = True
        return "(시뮬레이션) 교체 완료 후 자동 재구성 예약됨"
    raise ToolError(f"알 수 없는 도구: {name}")


def finish(ctx: dict) -> dict:
    acts = [f"work_order:{o['task']}" for o in ctx["orders"]] + (["raid_rebuild"] if ctx["rebuild"] else [])
    return {"executed_actions": acts, "backup_checked": ctx["backup_checked"]}


def _t(name, **inp):
    return {"type": "tool_use", "name": name, "input": inp}


def _say(text):
    return {"type": "text", "text": text}


_FINAL = """**원인/위험도: 상** — Drive 3(sdd) 물리 불량이 진행 중(보류 섹터 12→48)이고 RAID5가 Degraded라 디스크 1개 추가 고장 시 데이터 손실.

**근거**: `get_sel`(예측 장애·RAID 저하·PSU2 순간 단절) · `get_raid_status`(Degraded) · `get_smart`(sdd 재할당 312, 보류 48 증가 추세) · `check_backup`(11-15 03:00 백업 검증 완료) · `get_spare_inventory`(동일 모델 2개)

**조치 결과**: 승인된 작업만 진행했습니다(감사 로그 approval 기록 참고). 재구성은 교체 완료 후 예약.

**남은 불확실성**: PSU2 AC 단절 원인(PDU B 포트) 현장 점검 필요. 5년차 동일 배치 디스크의 연쇄 고장 가능성."""

MOCK = {
    "normal": [
        [_say("이벤트 로그와 RAID 상태로 위험도를 먼저 판단하겠습니다."), _t("get_sel", server="DB-PRD-03"), _t("get_raid_status", server="DB-PRD-03")],
        [_t("get_smart", server="DB-PRD-03", disk="sdd"), _t("get_psu_status", server="DB-PRD-03")],
        [_say("위험도 상입니다. 작업 전 백업부터 확인합니다."), _t("check_backup", server="DB-PRD-03"), _t("get_spare_inventory")],
        [_t("create_work_order", server="DB-PRD-03", task="Drive 3 디스크 교체 (예비 SSD 사용) + PDU B 포트 점검", window="오늘 22:00~23:00")],
        [_t("start_raid_rebuild", server="DB-PRD-03", reason="교체 후 RAID5 복구")],
        [_say(_FINAL)],
    ],
    # 서두르는 에이전트: 백업 확인 없이 재구성부터 → 도구의 사전 조건이 막는다
    "rush": [
        [_t("get_raid_status", server="DB-PRD-03")],
        [_say("RAID가 저하됐으니 바로 재구성하겠습니다."), _t("start_raid_rebuild", server="DB-PRD-03", reason="빠른 복구")],
        [_say("사전 조건이 있네요. 백업과 디스크 상태부터 확인하겠습니다."), _t("check_backup", server="DB-PRD-03"), _t("get_smart", server="DB-PRD-03", disk="sdd")],
        [_t("create_work_order", server="DB-PRD-03", task="Drive 3 디스크 교체", window="오늘 22:00~23:00")],
        [_say(_FINAL)],
    ],
}
