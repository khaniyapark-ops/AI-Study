"""마스킹 규칙 테스트:  python3 -m pytest -q test_mask.py"""
from mask import mask


def m(s):
    return mask(s)[0]


def test_resident_number():
    assert m("주민번호 900101-1234567 확인") == "주민번호 [주민번호] 확인"


def test_card():
    assert m("카드 1234-5678-9012-3456 결제") == "카드 [카드번호] 결제"


def test_phone_and_landline():
    assert m("연락처 010-1234-5678, 02-123-4567") == "연락처 [휴대전화], [전화번호]"


def test_email_ip_key():
    out = m("user.kim@corp.co.kr 가 10.20.0.1 에서 sk-ant-abcdefghijklmnopqrstu 사용")
    assert out == "[이메일] 가 [IP] 에서 [비밀키] 사용"


def test_password_value():
    assert m("db password=Secr3t! 로 접속") == "db password=[비밀번호] 로 접속"


def test_account():
    assert m("환불 계좌 110-123-456789 로") == "환불 계좌 [계좌번호] 로"


def test_no_false_positive_on_log_numbers():
    # 장애 로그의 시각·건수·주문번호는 남아야 분석이 가능하다
    line = "2026-11-06 02:10:01 WARN total=20 active=20 order=88231 rows=184220"
    assert m(line) == line


def test_counts():
    _, c = mask("010-1111-2222 010-3333-4444 a@b.com")
    assert c == {"휴대전화": 2, "이메일": 1}
