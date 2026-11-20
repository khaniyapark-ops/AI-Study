"""콘솔 출력 인코딩 보정 (Windows cp949 콘솔·파일 리디렉션에서 한글·이모지 출력 오류 방지)."""
import sys


def setup_console() -> None:
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass  # 재설정할 수 없는 스트림(일부 IDE 콘솔)은 그대로 둔다
