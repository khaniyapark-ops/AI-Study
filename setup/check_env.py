"""수강생 PC 사전 점검 (Windows · macOS · Linux 공통, 표준 라이브러리만 사용)

실행:
  Windows :  py -3 setup\\check_env.py      (또는 python setup\\check_env.py)
  macOS   :  python3 setup/check_env.py

API 키 값은 읽거나 출력하지 않는다. 설정 여부만 확인한다.
"""
from __future__ import annotations

import os
import platform
import socket
import subprocess
import sys
import tempfile
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parent.parent
LAB = ROOT / "advanced" / "agent_lab"
results: list[tuple[str, str, str, str]] = []  # (등급, 항목, 결과, 조치)


def add(level, item, result, fix=""):
    results.append((level, item, result, fix))


def run(cmd, cwd):
    env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1")
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8",
                          errors="replace", env=env, timeout=120)


# 1. 파이썬
v = sys.version_info
add("OK" if v >= (3, 10) else "FAIL", "Python 버전", f"{platform.python_version()} ({platform.system()} {platform.release()})",
    "" if v >= (3, 10) else "Python 3.10 이상 설치 (python.org 또는 사내 소프트웨어 센터)")

# 2. 교육 자료 폴더
need = {"기본 데모": ROOT / "demo" / "index.html", "실습 샘플": ROOT / "sample-system" / "billing.py",
        "심화 실습 키트": LAB / "agent.py"}
for name, p in need.items():
    add("OK" if p.exists() else "FAIL", f"자료: {name}", str(p.relative_to(ROOT)) if p.exists() else "없음",
        "" if p.exists() else "교육 자료 전체 폴더를 다시 복사")

# 3. 쓰기 권한 (실습 결과 runs/ 폴더)
try:
    LAB.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=LAB, delete=True):
        pass
    add("OK", "폴더 쓰기 권한", "가능")
except Exception as e:
    add("FAIL", "폴더 쓰기 권한", f"불가 ({type(e).__name__})", "바탕화면·문서 등 쓰기 가능한 위치로 자료 폴더를 옮기기")

# 4. 한글·이모지 출력
try:
    print("출력 시험: 🎯 🔧 👁 🛑 ✅", flush=True)
    add("OK", "한글·이모지 출력", f"stdout 인코딩 {sys.stdout.encoding}")
except Exception as e:
    add("WARN", "한글·이모지 출력", f"오류 ({type(e).__name__})", "Windows Terminal 사용 권장. 또는 환경변수 PYTHONUTF8=1 설정")

# 5. pytest
try:
    import pytest  # noqa: F401
    add("OK", "pytest", "설치됨")
    has_pytest = True
except ImportError:
    add("FAIL", "pytest", "없음", f"{Path(sys.executable).name} -m pip install pytest  (막히면 강사에게 오프라인 설치 파일 요청)")
    has_pytest = False

# 6. 기본 실습 시작 상태: 테스트 1건 실패가 정상
if has_pytest and need["실습 샘플"].exists():
    r = run([sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider"], ROOT / "sample-system")
    last = (r.stdout.strip().splitlines() or ["(출력 없음)"])[-1]
    ok = "1 failed, 2 passed" in last
    add("OK" if ok else "WARN", "실습 샘플 시작 상태", last,
        "" if ok else "정상은 '1 failed, 2 passed'. 이미 고쳐졌다면 자료를 다시 복사")

# 7. 심화 모의 실행 (키·인터넷 불필요)
if need["심화 실습 키트"].exists():
    r = run([sys.executable, "agent.py", "--pack", "settle", "--mock", "--approve", "deny", "--max-iter", "3"], LAB)
    ok = r.returncode == 0 and "종료" in r.stdout
    add("OK" if ok else "FAIL", "심화 모의 실행", "정상" if ok else (r.stderr.strip().splitlines() or ["실패"])[-1][:120],
        "" if ok else "오류 메시지를 강사에게 전달")

# 8. 라이브 실행 준비 (선택)
try:
    import anthropic
    add("OK", "[라이브] Anthropic SDK", f"설치됨 {anthropic.__version__}")
except ImportError:
    add("INFO", "[라이브] Anthropic SDK", "없음 (모의 실행만 할 때는 불필요)",
        f"{Path(sys.executable).name} -m pip install -r advanced/agent_lab/requirements.txt")
key = bool(os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN"))
add("OK" if key else "INFO", "[라이브] API 자격 증명", "설정됨 (값은 확인하지 않음)" if key else "없음 (라이브 실습 때 강사가 안내)")
proxy = [k for k in ("HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy") if os.environ.get(k)]
try:
    with socket.create_connection(("api.anthropic.com", 443), timeout=4):
        pass
    add("OK", "[라이브] api.anthropic.com 연결", "가능" + (" (프록시 설정 있음)" if proxy else ""))
except OSError as e:
    add("INFO", "[라이브] api.anthropic.com 연결", f"불가 ({type(e).__name__})" + (" · 프록시 설정 있음" if proxy else ""),
        "망분리·폐쇄망이면 정상입니다. 기본 데모는 오프라인 재생, 심화는 모의 실행으로 진행")

# 결과
mark = {"OK": "✅", "WARN": "⚠️ ", "FAIL": "❌", "INFO": "ℹ️ "}
print("\n=== 교육 환경 점검 결과 ===")
for lvl, item, res, fix in results:
    print(f"{mark[lvl]} {item:28} {res}")
    if fix:
        print(f"     → {fix}")
fails = [r for r in results if r[0] == "FAIL"]
live = all(r[0] == "OK" for r in results if r[1].startswith("[라이브]"))
print("\n=== 판정 ===")
print(f"기본 과정 (브라우저 데모 오프라인 재생): {'가능' if need['기본 데모'].exists() else '불가'}")
basic_lab = not [r for r in fails if r[1] in ('Python 버전', 'pytest', '자료: 실습 샘플')]
print(f"기본 과정 실습 (pytest 버그 수정)    : {'가능' if basic_lab else '불가 — 위 ❌ 조치 필요'}")
adv = not [r for r in fails if r[1] in ('Python 버전', '심화 모의 실행', '폴더 쓰기 권한')]
print(f"심화 과정 모의 실행                  : {'가능' if adv else '불가 — 위 ❌ 조치 필요'}")
print(f"라이브 실행 (실제 Claude 호출)        : {'가능' if live else '준비 필요 (선택 사항)'}")
sys.exit(1 if fails else 0)
