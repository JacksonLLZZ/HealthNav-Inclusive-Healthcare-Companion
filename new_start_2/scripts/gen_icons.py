"""Generate 81x81 PNG tabBar icons — consistent size, style & visual weight.

All icons:
- 81x81 canvas
- Balanced ink ratio (~1500-2200px filled)
- Same visual style (thin outline + subtle fill)
- Business-relevant designs
"""

import struct, zlib, os

OUT_DIR = "e:/WorkPlace/new_start/new start - 副本/new start/images/tab"
SIZE = 81

def make_chunk(chunk_type, data):
    c = chunk_type + data
    return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

def create_png(pixels, palette):
    raw = b""
    for row in pixels:
        raw += b"\x00"
        raw += bytes(row)
    plte_data = b""
    for r, g, b in palette:
        plte_data += bytes([r, g, b])
    trns_data = bytes([0])
    ihdr = struct.pack(">IIBBBBB", SIZE, SIZE, 8, 3, 0, 0, 0)
    idat = zlib.compress(raw)
    png = b"\x89PNG\r\n\x1a\n"
    png += make_chunk(b"IHDR", ihdr)
    png += make_chunk(b"PLTE", plte_data)
    png += make_chunk(b"tRNS", trns_data)
    png += make_chunk(b"IDAT", idat)
    png += make_chunk(b"IEND", b"")
    return png


def fill_rect(pix, x1, y1, x2, y2, val):
    for y in range(max(0, y1), min(SIZE, y2+1)):
        for x in range(max(0, x1), min(SIZE, x2+1)):
            pix[y][x] = val

def draw_rect_outline(pix, x1, y1, x2, y2, w, val):
    """Draw a rectangle outline with stroke width w."""
    fill_rect(pix, x1, y1, x2, y1+w-1, val)  # top
    fill_rect(pix, x1, y2-w+1, x2, y2, val)  # bottom
    fill_rect(pix, x1, y1, x1+w-1, y2, val)  # left
    fill_rect(pix, x2-w+1, y1, x2, y2, val)  # right

def circle_fill(pix, cx, cy, r, val):
    for y in range(SIZE):
        for x in range(SIZE):
            dx, dy = x - cx, y - cy
            if dx*dx + dy*dy <= r*r:
                pix[y][x] = val

def draw_circle_outline(pix, cx, cy, r, w, val):
    """Draw a circle outline with stroke width w."""
    for y in range(SIZE):
        for x in range(SIZE):
            dx, dy = x - cx, y - cy
            dist = (dx*dx + dy*dy) ** 0.5
            if r - w <= dist <= r:
                pix[y][x] = val


def gen_booking(color):
    """Calendar outline with date — appointment booking."""
    r, g, b = color
    pal = [(0,0,0), (r,g,b)]
    pix = [[0]*SIZE for _ in range(SIZE)]

    # Calendar body: rounded square outline (~58x48)
    body_x1, body_y1 = 13, 22
    body_x2, body_y2 = 67, 72
    sw = 5  # stroke width

    draw_rect_outline(pix, body_x1, body_y1, body_x2, body_y2, sw, 1)

    # Calendar header bar (top band)
    fill_rect(pix, body_x1+5, body_y1+2, body_x2-5, body_y1+14, 1)

    # Two hooks on top (calendar rings)
    fill_rect(pix, 24, 17, 28, 22, 1)
    fill_rect(pix, 52, 17, 56, 22, 1)

    # Date numbers inside: two horizontal lines + a small square
    fill_rect(pix, 24, 44, 40, 47, 1)  # line 1
    fill_rect(pix, 24, 54, 50, 57, 1)  # line 2
    fill_rect(pix, 48, 38, 58, 48, 1)  # date block highlight

    return pix, pal


def gen_clinic(color):
    """Medical cross in a square outline — clinic/hospital."""
    r, g, b = color
    pal = [(0,0,0), (r,g,b)]
    pix = [[0]*SIZE for _ in range(SIZE)]

    sw = 5

    # Square outline
    draw_rect_outline(pix, 14, 14, 66, 66, sw, 1)

    # Medical cross — solid, centered
    cx, cy = 40, 40
    fill_rect(pix, cx-5, cy-14, cx+5, cy+14, 1)  # vertical bar (10 wide)
    fill_rect(pix, cx-14, cy-5, cx+14, cy+5, 1)  # horizontal bar (10 tall)

    return pix, pal


def gen_profile(color):
    """Person silhouette — filled head & shoulders."""
    r, g, b = color
    pal = [(0,0,0), (r,g,b)]
    pix = [[0]*SIZE for _ in range(SIZE)]

    cx = 40

    # Filled head circle
    circle_fill(pix, cx, 23, 12, 1)

    # Filled body trapezoid
    for y in range(36, 72):
        t = (y - 36) / (72 - 36)
        half = 13 + (26 - 13) * t
        fill_rect(pix, int(cx - half), y, int(cx + half), y, 1)

    return pix, pal


GRAY = (153, 153, 153)
GREEN = (26, 122, 92)

icons = [
    ("booking.png", "booking_hl.png", gen_booking),
    ("clinic.png", "clinic_hl.png", gen_clinic),
    ("profile.png", "profile_hl.png", gen_profile),
]

os.makedirs(OUT_DIR, exist_ok=True)

for fname, fname_hl, generator in icons:
    pix_gray, pal = generator(GRAY)
    data = create_png(pix_gray, pal)
    path = os.path.join(OUT_DIR, fname)
    with open(path, "wb") as f:
        f.write(data)
    ink = sum(row.count(1) for row in pix_gray)
    print(f"{fname}: {len(data)} bytes, ink={ink}px ({ink*100/(SIZE*SIZE):.1f}%)")

    pix_green, pal = generator(GREEN)
    data = create_png(pix_green, pal)
    path = os.path.join(OUT_DIR, fname_hl)
    with open(path, "wb") as f:
        f.write(data)
    ink = sum(row.count(1) for row in pix_green)
    print(f"{fname_hl}: {len(data)} bytes, ink={ink}px ({ink*100/(SIZE*SIZE):.1f}%)")

print("Done!")
