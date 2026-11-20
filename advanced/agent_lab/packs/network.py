"""N/W 엔지니어 트랙: 코어 스위치 업링크 플래핑 대응 에이전트 (가상 장비)."""
from __future__ import annotations

from pathlib import Path

from harness import ToolError
from packs import REPORT_RULE, obj, s

NAME = "network"
TITLE = "업링크 플래핑 대응 (시뮬레이션)"
TRACK = "N/W 엔지니어 · 운영자"
GOAL = "SW-CORE-02 업링크 Te1/0/24가 새벽 03:14부터 끊겼고 같은 시각 DB 복제 지연 알람이 왔습니다. 원인을 좁히고 복구 방안을 진행해 주세요."
SYSTEM = ("당신은 네트워크 운영 에이전트입니다. 조회 명령(show 계열)으로 증거를 모으고, 설정 변경은 변경 도구로만 요청합니다.\n"
          "- 물리 작업(광모듈·케이블 교체)은 직접 할 수 없으니 현장 작업 요청으로 보고하세요." + REPORT_RULE)

DEVICES = {"SW-CORE-02": {"Te1/0/24": "err-disabled", "Te1/0/23": "up"}}
LOGGING = """Nov 12 03:14:07 %LINK-3-UPDOWN: Interface Te1/0/24, changed state to down
Nov 12 03:14:09 %LINK-3-UPDOWN: Interface Te1/0/24, changed state to up
Nov 12 03:14:15 %LINK-3-UPDOWN: Interface Te1/0/24, changed state to down
Nov 12 03:14:16 %BGP-5-ADJCHANGE: neighbor 10.20.0.1 Down Interface flap
Nov 12 03:14:31 %PM-4-ERR_DISABLE: link-flap error detected on Te1/0/24, putting in err-disable state"""
TRANSCEIVER = {
    "Te1/0/24": "SFP-10G-LR  Rx Power: -16.8 dBm (low alarm -14.4)  Tx Power: -2.1 dBm  Temp 41C  ← 수신 레벨 경보",
    "Te1/0/23": "SFP-10G-LR  Rx Power: -3.2 dBm  Tx Power: -2.0 dBm  Temp 39C  (정상)",
}
CHANGES = "2026-11-10 22:00 Te1/0/24 광모듈 교체 (작업자 김○○, 티켓 CHG-3321)\n2026-10-02 22:00 IOS 업그레이드 17.9.4"

TOOLS = [
    {"name": "show_logging", "kind": "read", "description": "장비 로그 조회", "input_schema": obj({"device": s(), "filter": s("포함 문자열, 전체는 빈 문자열")})},
    {"name": "show_interface", "kind": "read", "description": "인터페이스 상태·오류 카운터", "input_schema": obj({"device": s(), "interface": s()})},
    {"name": "show_transceiver", "kind": "read", "description": "광모듈 송수신 레벨", "input_schema": obj({"device": s(), "interface": s()})},
    {"name": "show_bgp_summary", "kind": "read", "description": "BGP 이웃 상태", "input_schema": obj({"device": s()})},
    {"name": "get_change_history", "kind": "read", "description": "장비 변경 이력", "input_schema": obj({"device": s()})},
    {"name": "set_interface_state", "kind": "write", "description": "인터페이스 상태 변경(shutdown/no shutdown/err-disable 해제). 사람 승인 + CAB 필요",
     "input_schema": obj({"device": s(), "interface": s(), "state": s(enum=["shutdown", "no_shutdown", "errdisable_recover"]), "reason": s()})},
]


def setup(run_dir: Path, opts: dict) -> dict:
    return {"state": {k: dict(v) for k, v in DEVICES.items()}, "changes": []}


def _dev(ctx, d):
    if d not in ctx["state"]:
        raise ToolError(f"장비 없음: {d}. 사용 가능: {', '.join(ctx['state'])}")
    return ctx["state"][d]


def execute(ctx: dict, name: str, a: dict) -> str:
    dev = _dev(ctx, a["device"])
    iface = a.get("interface")
    if iface is not None and iface not in dev:
        raise ToolError(f"인터페이스 없음: {iface}. 사용 가능: {', '.join(dev)}")
    if name == "show_logging":
        lines = [l for l in LOGGING.splitlines() if a["filter"] in l]
        return "\n".join(lines) or "해당 로그 없음"
    if name == "show_interface":
        st = dev[iface]
        crc = "CRC 1,284, input errors 1,302" if iface == "Te1/0/24" else "CRC 0, input errors 0"
        return f"{iface} is {st}, line protocol is {'down' if st != 'up' else 'up'}\n  {crc}\n  Last flap: 03:14:15"
    if name == "show_transceiver":
        return TRANSCEIVER[iface]
    if name == "show_bgp_summary":
        return "Neighbor 10.20.0.1 (IDC-B, via Te1/0/24)  State: Idle\nNeighbor 10.20.0.5 (IDC-B, via Te1/0/23)  State: Established  ← 예비 경로 정상"
    if name == "get_change_history":
        return CHANGES
    if name == "set_interface_state":
        dev[iface] = "up" if a["state"] in ("no_shutdown", "errdisable_recover") else "admin down"
        ctx["changes"].append(a)
        note = " (주의: 광 레벨이 낮은 상태라 다시 플래핑할 수 있음)" if dev[iface] == "up" and iface == "Te1/0/24" else ""
        return f"(시뮬레이션) {a['device']} {iface} → {dev[iface]}{note}"
    raise ToolError(f"알 수 없는 도구: {name}")


def finish(ctx: dict) -> dict:
    return {"executed_actions": [f"{c['interface']}:{c['state']}" for c in ctx["changes"]]}


def _t(name, **inp):
    return {"type": "tool_use", "name": name, "input": inp}


def _say(text):
    return {"type": "text", "text": text}


MOCK = {
    "normal": [
        [_say("로그와 인터페이스 상태부터 보고, 광 레벨과 변경 이력으로 원인을 좁히겠습니다."),
         _t("show_logging", device="SW-CORE-02", filter="Te1/0/24"), _t("show_interface", device="SW-CORE-02", interface="Te1/0/24")],
        [_t("show_transceiver", device="SW-CORE-02", interface="Te1/0/24"), _t("show_transceiver", device="SW-CORE-02", interface="Te1/0/23")],
        [_t("get_change_history", device="SW-CORE-02"), _t("show_bgp_summary", device="SW-CORE-02")],
        [_say("""**원인**: 11/10 교체한 Te1/0/24 광모듈(또는 패치코드)의 수신 레벨 저하(-16.8dBm, 경보 기준 -14.4dBm 미만)로 링크 플래핑 → err-disable.

**근거**: `show_logging`(03:14 플래핑 3회 후 err-disable) · `show_transceiver`(Rx -16.8dBm, 인접 포트는 -3.2dBm 정상) · `show_interface`(CRC 1,284) · `get_change_history`(11/10 광모듈 교체 CHG-3321)

**조치 결과**: 설정 변경은 하지 않았습니다. 광 레벨이 낮은 상태에서 err-disable을 해제하면 다시 플래핑하므로, 현장에서 모듈·패치코드 점검/교체 후 해제를 요청합니다. 예비 경로(Te1/0/23, BGP 10.20.0.5)는 정상이라 서비스는 우회 중입니다.

**남은 불확실성**: DB 복제 지연이 이 경로 단절 때문인지는 복제 경로 설정 확인 필요.""")],
    ],
}
