from billing import calc_fee, settle

def test_basic():
    assert calc_fee(10000) == 300

def test_min_fee():
    assert calc_fee(1000) == 100

def test_partial_cancel_refunds_proportionally():
    # 30,000원 결제(수수료 900) 중 10,000원 부분취소 -> 수수료는 300 환급(-300)이어야 함
    assert calc_fee(10000, True, 900 // 3) == -300
