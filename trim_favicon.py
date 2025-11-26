#!/usr/bin/env python3
from PIL import Image, ImageDraw

def add_rounded_corners(img, radius_percent=20):
    """给图片添加圆角"""
    # 创建一个圆角遮罩
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)
    
    # 计算圆角半径
    radius = min(img.size) * radius_percent // 100
    
    # 绘制圆角矩形
    draw.rounded_rectangle([(0, 0), img.size], radius=radius, fill=255)
    
    # 应用遮罩
    output = Image.new('RGBA', img.size, (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    return output

# 打开原图
img = Image.open('public/favicon.jpg')

# 转换为RGBA模式
img = img.convert('RGBA')

# 获取图片数据
datas = img.getdata()

# 将白色（或接近白色）变为透明
newData = []
for item in datas:
    # 如果RGB都大于240（接近白色），则设为透明
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        newData.append((255, 255, 255, 0))  # 完全透明
    else:
        newData.append(item)

img.putdata(newData)

# 裁剪透明边缘
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# 保存180x180的Apple Touch图标（圆角）
apple_img = img.copy()
apple_img.thumbnail((180, 180), Image.Resampling.LANCZOS)
# 创建一个正方形画布
apple_square = Image.new('RGBA', (180, 180), (0, 0, 0, 0))
# 居中粘贴
offset = ((180 - apple_img.width) // 2, (180 - apple_img.height) // 2)
apple_square.paste(apple_img, offset, apple_img)
# 添加圆角
apple_rounded = add_rounded_corners(apple_square, radius_percent=22)
apple_rounded.save('public/apple-touch-icon.png', 'PNG')

# 保存常规favicon
img.thumbnail((48, 48), Image.Resampling.LANCZOS)
img.save('public/favicon-48.png', 'PNG')

img.thumbnail((32, 32), Image.Resampling.LANCZOS)
img.save('public/favicon-32.png', 'PNG')

img.thumbnail((16, 16), Image.Resampling.LANCZOS)
img.save('public/favicon-16.png', 'PNG')

print("✓ 已生成透明背景的favicon文件")
print("✓ 已生成圆角的Apple Touch图标")
