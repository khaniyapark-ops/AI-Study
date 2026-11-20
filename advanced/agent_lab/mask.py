"""개인정보·민감정보 마스킹.

두 가지로 쓴다.
1) 하니스 연동: agent.py --mask  → 도구 결과를 모델에 보내기 전에 마스킹 (감사 로그에는 건수만 기록)
2) 단독 실행:   python3 mask.py 입력파일 [출력파일]   → 실제 로그·티켓을 교육/실습용으로 가릴 때

주의: 정규식 마스킹은 '기본 방어선'일 뿐 완벽하지 않다. 이름·주소처럼 형식이 없는 정보는 잡지 못한다.
실제 고객 데이터는 반드시 사람이 결과를 확인한 뒤 사용한다.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

# (이름, 패턴, 대체 문자열) — 위에서부터 순서대로 적용 (긴/구체적인 패턴 먼저)
RULES: list[tuple[str, re.Pattern, str]] = [
    ("주민등록번호", re.compile(r"\b\d{6}\s?-\s?[1-8]\d{6}\b"), "[주민번호]"),
    ("카드번호", re.compile(r"\b(?:\d{4}[- ]){3}\d{4}\b"), "[카드번호]"),
    ("이메일", re.compile(r"\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b"), "[이메일]"),
    ("휴대전화", re.compile(r"\b01[016789][- ]?\d{3,4}[- ]?\d{4}\b"), "[휴대전화]"),
    ("유선전화", re.compile(r"\b0(?:2|[3-6][1-5])[- ]?\d{3,4}[- ]?\d{4}\b"), "[전화번호]"),
    ("계좌번호", re.compile(r"\b\d{2,6}-\d{2,6}-\d{2,8}(?:-\d{1,3})?\b"), "ACCOUNT"),
    ("IP주소", re.compile(r"\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b"), "[IP]"),
    ("API키·토큰", re.compile(r"\b(?:sk-[A-Za-z0-9_-]{16,}|AKIA[0-9A-Z]{16}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,})"), "[비밀키]"),
    ("비밀번호 값", re.compile(r"(?i)\b(password|passwd|pwd|비밀번호)\s*[:=]\s*\S+"), r"\1=[비밀번호]"),
]


_DATE = re.compile(r"^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$")


def _account(m: re.Match) -> str:
    s = m.group(0)
    if _DATE.match(s) or sum(ch.isdigit() for ch in s) < 10:
        return s
    return "[계좌번호]"


def mask(text: str, keep: set[str] | frozenset = frozenset()) -> tuple[str, dict[str, int]]:
    """마스킹한 문자열과 종류별 건수를 돌려준다. keep에 넣은 규칙 이름(예: {"IP주소"})은 건너뛴다."""
    counts: dict[str, int] = {}
    for name, pat, rep in RULES:
        if name in keep:
            continue
        if rep == "ACCOUNT":
            rep = _account  # 날짜(2026-11-06)·짧은 번호는 계좌로 보지 않는다
        text, n = pat.subn(rep, text)
        if rep is _account:
            n = text.count("[계좌번호]") - counts.get(name, 0)
        if n:
            counts[name] = counts.get(name, 0) + n
    return text, counts


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("사용법: python3 mask.py 입력파일 [출력파일]")
    src = Path(sys.argv[1])
    out, counts = mask(src.read_text(encoding="utf-8", errors="replace"))
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else src.with_name(src.stem + ".masked" + src.suffix)
    dst.write_text(out, encoding="utf-8")
    total = sum(counts.values())
    print(f"마스킹 {total}건 → {dst}")
    for k, v in counts.items():
        print(f"  - {k}: {v}건")
    print("※ 이름·주소·사내 고유명칭 등 형식이 없는 정보는 사람이 직접 확인하세요.")


if __name__ == "__main__":
    from console import setup_console
    setup_console()
    main()
