"""Generate a QR-code-like placeholder image (210x210)."""
import struct, zlib, os

SIZE = 210
OUT = "e:/WorkPlace/new_start/new start - 副本/new start/images/booking/qr_placeholder.png"

def make_chunk(t, d):
    c = t + d
    return struct.pack(">I", len(d)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

palette = [(255,255,255), (0,0,0)]
pix = [[0]*SIZE for _ in range(SIZE)]

# Helper
def fill(x, y, w, h):
    for yy in range(y, y+h):
        for xx in range(x, x+w):
            if 0 <= xx < SIZE and 0 <= yy < SIZE:
                pix[yy][xx] = 1

def finder_pattern(cx, cy):
    """7x7 finder pattern with 3x3 core"""
    fill(cx-3, cy-3, 7, 7)   # outer
    fill(cx-2, cy-2, 5, 5)   # white (skip)
    fill(cx-1, cy-1, 3, 3)   # inner

def timing_pattern():
    for i in range(6, SIZE-6, 2):
        pix[6][i] = 1
        pix[i][6] = 1

# Finder patterns at three corners
finder_pattern(9, 9)
finder_pattern(SIZE-10, 9)
finder_pattern(9, SIZE-10)

# Timing patterns
timing_pattern()

# Random data modules (deterministic pseudo-random)
import hashlib
seed = "checkin_001"
h = hashlib.md5(seed.encode()).hexdigest()
r = [int(h[i:i+2], 16) for i in range(0, len(h), 2)]

idx = 0
for y in range(10, SIZE-10, 4):
    for x in range(10, SIZE-10, 4):
        # Skip over finder patterns and timing
        if (x < 16 and y < 16) or (x > SIZE-18 and y < 16) or (x < 16 and y > SIZE-18):
            continue
        if x == 6 or y == 6:
            continue
        if r[idx % len(r)] > 127:
            fill(x, y, 3, 3)
        idx += 1

# Quiet zone is already white (background), no need to draw

raw = b""
for row in pix:
    raw += b"\x00" + bytes(row)

plte = b"".join(bytes([r,g,b]) for r,g,b in palette)
trns = bytes([0])
ihdr = struct.pack(">IIBBBBB", SIZE, SIZE, 8, 3, 0, 0, 0)
idat = zlib.compress(raw)
png = b"\x89PNG\r\n\x1a\n"
png += make_chunk(b"IHDR", ihdr)
png += make_chunk(b"PLTE", plte)
png += make_chunk(b"tRNS", trns)
png += make_chunk(b"IDAT", idat)
png += make_chunk(b"IEND", b"")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "wb") as f:
    f.write(png)
print(f"Created {OUT} ({len(png)} bytes)")
