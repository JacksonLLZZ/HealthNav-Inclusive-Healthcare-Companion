"""Generate a placeholder image for consult demo."""
import struct, zlib, os

SIZE = 280
OUT = "e:/WorkPlace/new_start/new start - 副本/new start/images/consult/placeholder.png"

def make_chunk(t, d):
    c = t + d
    return struct.pack(">I", len(d)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

palette = [(0,0,0), (200,210,220)]
pix = [[0]*SIZE for _ in range(SIZE)]
# Draw a simple medical-like placeholder with a cross
cx, cy = SIZE//2, SIZE//2
for y in range(SIZE):
    for x in range(SIZE):
        dx, dy = x - cx, y - cy
        # Simple cross shape
        in_v = abs(x - cx) < 20 and abs(y - cy) < 60
        in_h = abs(y - cy) < 20 and abs(x - cx) < 60
        if in_v or in_h:
            pix[y][x] = 1
        # border
        if x == 0 or x == SIZE-1 or y == 0 or y == SIZE-1:
            pix[y][x] = 1

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
