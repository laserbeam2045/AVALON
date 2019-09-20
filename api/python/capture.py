from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from PIL import ImageGrab
import matplotlib.pyplot as plt
import numpy as np
import pywinauto
from pywinauto.application import Application
import math
import time

APP_DIR = r"C:\Program Files (x86)\Apowersoft\Apowersoft iPhone Recorder\Apowersoft iPhone Recorder.exe"
APP_NAME = u'Apowersoft iPhone録画究極'

# 720p 1280*720
#DEFAULT_APP_WIDTH = 526
#DEFAULT_APP_HEIGHT = 972
#DEFAULT_MARGIN_TOP = 539
#APP_WIDTH  = 340
#APP_HEIGHT = 640
#MARGIN_TOP = 360

DROP_SIZE = 46
TEMPLATE_NUM = 137

# iphone 6 720*1280
DEFAULT_APP_WIDTH = 416
DEFAULT_APP_HEIGHT = 772
DEFAULT_MARGIN_TOP = 432
APP_WIDTH  = DEFAULT_APP_WIDTH
APP_HEIGHT = DEFAULT_APP_HEIGHT
MARGIN_TOP = DEFAULT_MARGIN_TOP

templates = []

# 再近傍法でクラスを求める関数
def k_nn(img):
    distances = []
    sample = np.asarray(img, dtype="int32")
    # 各標本との差からL2ノルム（ユークリッド距離）を求める
    for template in templates:
        distance = np.linalg.norm(template - sample)
        distances.append(distance)

    # 最も距離が近い標本のインデックスから、クラスを決める
    index = distances.index(min(distances)) + 1
    if index in [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 97, 98, 99, 123, 137]: return 1
    if index in [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 100, 101, 102, 128, 132, 133, 134]: return 2
    if index in [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 103, 104, 105, 106, 107, 108, 129, 130]: return 3
    if index in [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 109, 110, 111, 112, 118, 119, 124, 125, 126, 135]: return 4
    if index in [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 113, 114, 115, 116, 117, 122, 136]: return 5
    if index in [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 120, 121]: return 6
    if index in [84, 85, 86, 87, 88, 127]: return 7
    if index in [89, 90, 91, 92]: return 8
    if index in [93, 94, 95, 96, 131]: return 9

# 盤面を取得する関数
def get_board(board_height, board_width):
    board = []
    margin_left  = 2 if (board_width == 6) else 8
    margin_right = 3 if (board_width == 6) else 9
    drop_width = (APP_WIDTH - (margin_left + margin_right)) / board_width
    drop_height = (APP_HEIGHT - MARGIN_TOP) / board_height

    # アプリケーションから盤面部分だけ画像として取得する
    board_img = app[APP_NAME].capture_as_image()\
                    .crop((margin_left, MARGIN_TOP, APP_WIDTH - margin_right, APP_HEIGHT))

    #board_img.save("board.png")

    # ドロップ単位で画像を切り抜き、色を判定して配列に入れる
    for y in range(board_height):
        ymin = drop_height * y
        ymax = drop_height * (y + 1)
        for x in range(board_width):
            xmin = drop_width * x
            xmax = drop_width * (x + 1)
            box = (xmin, ymin, xmax, ymax)
            img = board_img.crop(box)
            img = img.resize((DROP_SIZE, DROP_SIZE))
            img.save("sample/drop_{}s.png".format(y*board_width+x+1))
            color = k_nn(img)
            board.append(color)
    return board

#Apowersoftとの接続を試みる(失敗なら起動)
app = Application()
try:    app.connect(path = APP_DIR)
except: app.start(cmd_line = APP_DIR)

#rect = app[APP_NAME].client_rect()
#print(rect.width())
#print(rect.height())
#app[APP_NAME].move_window(x=None, y=None, width=APP_WIDTH, height=APP_HEIGHT, repaint=True)

# 事前にテンプレート画像を１次元ベクトル化しておく
for i in range(1, TEMPLATE_NUM + 1):
    img = Image.open("template/drop_{}.png".format(i))
    img = img.resize((DROP_SIZE, DROP_SIZE))
    templates.append(np.asarray(img, dtype="int32"))

api = Flask(__name__)
CORS(api)

# API待ち受け
@api.route('/api/capture/<int:board_height>x<int:board_width>', methods=['GET'])
def capture_board(board_height, board_width):
    start = time.time()
    board = get_board(board_height, board_width)
    elapsed_time = time.time() - start
    print("\nelapsed_time: {0}".format(elapsed_time) + "[sec]")
    return jsonify({'board': board})

if __name__ == '__main__':
    api.run(port=8000)