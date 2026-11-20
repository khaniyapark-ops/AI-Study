# 실습용 샘플 시스템 (가상의 정산 시스템)
- tickets.csv : 유지보수 접수 티켓 6건
- app.log     : T-1005 배치 장애 로그
- billing.py / test_billing.py : T-1004 수수료 이중 차감 버그 (테스트 1건 실패)

실습: `python3 -m pytest` 로 실패 확인 → AI에게 원인 분석/수정/테스트 보강을 요청
