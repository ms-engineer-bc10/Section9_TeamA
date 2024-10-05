def parse_price(price_str):
    price_str = price_str.replace('¥', '').replace(',', '').strip()
    if '〜' in price_str:
        price_range = price_str.split('〜')
        price_from = int(price_range[0]) if price_range else 0
        price_to = int(price_range[1]) if len(price_range) > 1 else 999999
    else:
        if price_str.endswith('〜'):
            price_from = int(price_str[:-1])
            price_to = 999999
        else:
            price_from = int(price_str)
            price_to = int(price_str)
    return price_from, price_to