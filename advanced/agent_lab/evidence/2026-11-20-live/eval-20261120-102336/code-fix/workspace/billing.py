"""레거시 수수료 계산 모듈 (교육용 샘플). 의도적으로 버그가 포함되어 있습니다."""

FEE_RATE = 0.03          # 기본 수수료율 3%
MIN_FEE = 100            # 최소 수수료 100원


def calc_fee(amount, is_partial_cancel=False, original_fee=0):
    fee = int(amount * FEE_RATE)
    if fee < MIN_FEE:
        fee = MIN_FEE
    if is_partial_cancel:
        # 부분취소: 원 수수료를 비례 환급해야 하나, 새 수수료를 또 차감함 (버그: T-1004)
        fee = -original_fee
    return fee


def settle(orders):
    total = 0
    for o in orders:
        total += calc_fee(o["amount"], o.get("partial", False), o.get("orig_fee", 0))
    return total
