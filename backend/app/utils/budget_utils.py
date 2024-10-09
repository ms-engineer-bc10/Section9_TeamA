def parse_budget(budget_str):
    budget_str = budget_str.replace('¥', '').replace(',', '').strip()
    if '〜' in budget_str:
        budget_range = budget_str.split('〜')
        budget_from = int(budget_range[0]) if budget_range else 0
        budget_to = int(budget_range[1]) if len(budget_range) > 1 else 999999
    else:
        if budget_str.endswith('〜'):
            budget_from = int(budget_str[:-1])
            budget_to = 999999
        else:
            budget_from = int(budget_str)
            budget_to = int(budget_str)
    return budget_from, budget_to
