def parse_budget(budget_str):
    budget_str = str(budget_str) if not isinstance(budget_str, str) else budget_str

    if not budget_str:
        return int(0), int(999999)

    budget_str = budget_str.replace('¥', '').replace(',', '').strip()

    if '〜' in budget_str:
        budget_range = budget_str.split('〜')
        budget_from = int(budget_range[0]) if budget_range[0] else int(0)
        budget_to = int(budget_range[1]) if len(budget_range) > 1 and budget_range[1] else int(999999)
    else:
        if budget_str.endswith('〜'):
            budget_from = int(budget_str[:-1]) if budget_str[:-1] else int(0)
            budget_to = int(999999)
        else:
            budget_from = int(budget_str) if budget_str else int(0)
            budget_to = budget_from

    return int(budget_from), int(budget_to)
