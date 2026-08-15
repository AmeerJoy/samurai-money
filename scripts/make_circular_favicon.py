from PIL import Image, ImageDraw
import os

source_path = "d:/Projects/SamuraiMoney-Production-Assets/game_ready_assets/brand/icon-flux-katana-draw-strike.webp"
if not os.path.exists(source_path):
    source_path = "d:/Projects/SamuraiMoney-Production-Assets/game_ready_assets/brand/app-icon.webp"

img = Image.open(source_path).convert("RGBA")
size = min(img.size)
img = img.crop(((img.width - size) // 2, (img.height - size) // 2, (img.width + size) // 2, (img.height + size) // 2))

# Render at 4x for super smooth antialiased circular mask
scale = 4
target_size = 512
mask_size = target_size * scale

mask = Image.new('L', (mask_size, mask_size), 0)
draw = ImageDraw.Draw(mask)
# Draw anti-aliased circle
draw.ellipse((0, 0, mask_size - 1, mask_size - 1), fill=255)
mask = mask.resize((target_size, target_size), Image.Resampling.LANCZOS)

# Resize image to target size
img_resized = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
circular_img = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
circular_img.paste(img_resized, (0, 0), mask=mask)

# Save to destination paths
destinations = [
    "d:/Projects/SamuraiMoney-Production-Assets/public/favicon.png",
    "d:/Projects/SamuraiMoney-Production-Assets/public/assets/brand/favicon.png",
    "d:/Projects/SamuraiMoney-Production-Assets/public/game_ready_assets/brand/favicon.png",
    "d:/Projects/SamuraiMoney-Production-Assets/src/assets/brand/favicon.png",
    "d:/Projects/SamuraiMoney-Production-Assets/game_ready_assets/brand/favicon.png"
]

for dest in destinations:
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    circular_img.save(dest, "PNG")

# Also save 32x32 favicon.ico
ico_dest = "d:/Projects/SamuraiMoney-Production-Assets/public/favicon.ico"
circular_img.resize((32, 32), Image.Resampling.LANCZOS).save(ico_dest, format='ICO')

print("Successfully generated circular favicons!")
