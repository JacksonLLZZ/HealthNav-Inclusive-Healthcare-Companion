"""Generate 81x81 tab bar icons (PNG-8) for Booking, Clinic, Profile."""
import struct, zlib, os

def make_png(width, height, pixels):
    """pixels: list of rows, each row is list of (r,g,b,a) tuples."""
    sig = b'\x89PNG\r\n\x1a\n'

    # IHDR: width, height, bit_depth=8, color_type=6 (RGBA)
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr) & 0xffffffff

    # IDAT: filter byte 0 + raw RGBA data, zlib-compressed
    raw = b'\x00'.join(bytes(p) for row in pixels for p in row)
    # Prepend filter byte for each row
    raw2 = b''
    for row in pixels:
        raw2 += b'\x00'  # No filter
        for r, g, b, a in row:
            raw2 += struct.pack('BBBB', r, g, b, a)
    comp = zlib.compress(raw2)
    idat_crc = zlib.crc32(b'IDAT' + comp) & 0xffffffff

    iend_crc = zlib.crc32(b'IEND') & 0xffffffff

    chunks = (
        struct.pack('>I', 13) + b'IHDR' + ihdr + struct.pack('>I', ihdr_crc),
        struct.pack('>I', len(comp)) + b'IDAT' + comp + struct.pack('>I', idat_crc),
        struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc),
    )
    return sig + b''.join(chunks)


def draw_rect(p, x1, y1, x2, y2, color):
    for y in range(max(0, y1), min(len(p), y2+1)):
        for x in range(max(0, x1), min(len(p[0]), x2+1)):
            p[y][x] = color

def draw_circle(p, cx, cy, r, color):
    h, w = len(p), len(p[0])
    for y in range(max(0, cy-r), min(h, cy+r+1)):
        for x in range(max(0, cx-r), min(w, cx+r+1)):
            if (x-cx)**2 + (y-cy)**2 <= r*r:
                p[y][x] = color

def gen_booking(color):
    W, H = 81, 81
    bg = (0,0,0,0)
    p = [[bg]*W for _ in range(H)]
    r, g, b = color

    # Calendar body
    draw_rect(p, 18, 26, 62, 70, (r,g,b,255))
    # Calendar header (darker top)
    draw_rect(p, 18, 26, 62, 38, (max(0,r-30), max(0,g-30), max(0,b-30), 255))
    # Two little tabs on top
    draw_rect(p, 24, 20, 30, 26, (r,g,b,255))
    draw_rect(p, 50, 20, 56, 26, (r,g,b,255))
    # Horizontal lines (calendar rows)
    for yy in (44, 52, 60):
        draw_rect(p, 22, yy, 58, yy+1, (r,g,b,100))
    # Vertical line (calendar columns)
    draw_rect(p, 40, 38, 40, 70, (r,g,b,60))

    return p

def gen_clinic(color):
    W, H = 81, 81
    bg = (0,0,0,0)
    p = [[bg]*W for _ in range(H)]
    r, g, b = color

    # Circle background
    draw_circle(p, 40, 42, 26, (r,g,b,255))
    # White plus sign
    w = (255,255,255,255)
    cx, cy = 40, 42
    # Horizontal bar
    draw_rect(p, cx-16, cy-6, cx+16, cy+6, w)
    # Vertical bar
    draw_rect(p, cx-6, cy-16, cx+6, cy+16, w)

    return p

def gen_profile(color):
    W, H = 81, 81
    bg = (0,0,0,0)
    p = [[bg]*W for _ in range(H)]
    r, g, b = color

    # Head
    draw_circle(p, 40, 24, 13, (r,g,b,255))
    # Body (trapezoid - wider at shoulders)
    for y in range(38, 72):
        t = (y - 38) / 34.0
        hw = int(8 + t * 20)  # expands from 8 to 28
        draw_rect(p, 40-hw, y, 40+hw, y, (r,g,b,255))

    return p

# === Main ===
GRAY = (153, 153, 153)
GREEN = (26, 122, 92)

shapes = [
    ('booking', gen_booking),
    ('clinic', gen_clinic),
    ('profile', gen_profile),
]

out = os.path.join(os.path.dirname(__file__), '..', 'images', 'tab')
os.makedirs(out, exist_ok=True)

for name, fn in shapes:
    # Normal
    data = make_png(81, 81, fn(GRAY))
    with open(os.path.join(out, f'{name}.png'), 'wb') as f:
        f.write(data)
    # Highlighted
    data = make_png(81, 81, fn(GREEN))
    with open(os.path.join(out, f'{name}_hl.png'), 'wb') as f:
        f.write(data)

print('Done: 6 icons generated in', out)
