#!/usr/bin/env python3
from PIL import Image

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

# 保存不同尺寸
img.thumbnail((48, 48), Image.Resampling.LANCZOS)
img.save('public/favicon-48.png', 'PNG')

img.thumbnail((32, 32), Image.Resampling.LANCZOS)
img.save('public/favicon-32.png', 'PNG')

img.thumbnail((16, 16), Image.Resampling.LANCZOS)
img.save('public/favicon-16.png', 'PNG')

print("✓ 已生成透明背景的favicon文件")
