# coding: utf-8
"""Prepare public lecture sources; --source-root points to the local materials workspace."""
import argparse
from pathlib import Path
import re
import shutil

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source-root', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
training = args.source_root / '招新培训'
docs = root / 'site/assets/docs'
third = training / '02_源稿与素材/第三次培训讲义/软件第三次培训课件-电机闭环控制-20261027'
shutil.copyfile(third.with_suffix('.html'), docs / 'sw-training-3.html')
shutil.copyfile(third.with_suffix('.pdf'), docs / 'sw-training-3.pdf')
source = training / '02_源稿与素材/第四次培训-数字图像处理/软件第四次培训讲义-数字图像处理.html'
html = source.read_text()

def diagram(crossing=False):
    # Course-native SVG, with no image data from the internal recording.
    road = ('<path d="M255 35H465V445H255Z M35 165H685V315H35Z" fill="white"/>' if crossing else
            '<path d="M130 390V145Q130 80 210 80H510Q590 80 590 145V390" fill="none" stroke="white" stroke-width="90"/>')
    direction = ('<path d="M360 405V80" stroke="#078D87" stroke-width="10" stroke-dasharray="18 12"/><path d="M335 115L360 80L385 115" fill="none" stroke="#078D87" stroke-width="10"/>' if crossing else
                 '<path d="M130 355V190" stroke="#078D87" stroke-width="10"/><path d="M110 220L130 190L150 220" fill="none" stroke="#078D87" stroke-width="10"/><text x="70" y="445" fill="white" font-size="24">发车区 / 返回区</text>')
    return f'<svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" font-family="PingFang SC,Microsoft YaHei,sans-serif"><rect width="720" height="480" rx="12" fill="#3269A0"/>{road}{direction}</svg>'
figures = re.findall(r'<figure><img\b[^>]*>\s*<figcaption>.*?</figcaption></figure>', html)
assert len(figures) == 2, 'Expected two internal frame figures; review source before publishing'
for figure, crossing in zip(figures, (False, True)):
    caption = '十字路口直行示意（教学示意图）' if crossing else '白色赛道与发车方向示意（教学示意图）'
    html = html.replace(figure, f'<figure>{diagram(crossing)}<figcaption>{caption}</figcaption></figure>', 1)
html = html.replace('学号以 2026 开头者使用阿克曼车（双电机与舵机）；其他学员使用差速车。', '培训使用阿克曼车（双电机与舵机）和差速车，车辆领取与分组按通知办理。')
html = html.replace('<h3>考核实拍</h3><p>左侧图为往年同题目考核实拍图。</p>', '<h3>赛道示意</h3><p>左侧示意说明白色赛道、蓝色背景与发车方向；具体路线以现场布置为准。</p>')
html = html.replace('场外录像无法替代车载灰度图。', '赛道示意不能替代车载灰度图。')
html = html.replace('<h3>考核实拍</h3><p>左图为往年同题目考核实拍图。十字有多个白色去向，本次要求直行。</p>', '<h3>十字直行</h3><p>左图为教学示意。十字有多个白色去向，本次要求直行。</p>')
html = html.replace('<br>历届考核场外留档：备课目录“历史影像”，约 2 s、26 s 帧。', '')
assert all(term not in html for term in ('历史影像', '场外留档', '往年同题目考核实拍'))
assert '<img' not in html, 'Internal frame image remains'
destination = root / 'content/lectures/sw-training-4.html'
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_text(html)
print('Prepared third-round HTML/PDF and fourth-round public PDF source (42 slides).')
