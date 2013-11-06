import shutil

import os

files = ["3bdb8f801ba14d1d45674f9e611566d5_1.jpg",
"ccdd5271382009add55d20e04d6d9b3d.jpg",
"b2deadfa140c0cb985d20984d37069f9_1.jpg",
"ecb333ee5010091fb6e3739d107ec360.jpg",
"ce77a6191f7111b19dd69edef590d6d3_1.jpg",
"7a769e219222953e95504f55053feec9.jpg",
"f0c6f901385737544864eb666078dcb2_1.jpg",
"f00cd517ad7806871f7bdaf244402741.jpg",
"6315a62795770e17500a790ba8718769.jpg",
"f1ddcfc783fa4201b4c1dcb8f444ddc3.jpg",
"586265002a00320792d3865ba7cdf5a1.jpg",
"f7241e2cf66440ddb59f3e3534278a1f.jpg",
"d946358bd8d081ebd2dc8f1b40ddf210_4.jpg",
"a986806e8b7fed63bda51bb7e0e1917d.jpg",
"697c8baeed9ff878eeef82dc1726b0e4.jpg",
"45322df423a38eb81eed0d7a87b4c049.jpg",
"9deb8e428fb03c7eb626744b29c069ef.jpg",
"3d3e89090d72ed77fe7abc7f5ae43b31.jpg",
"141985c0f93396e5e6873799374caa3a.jpg",
"8ec72ab260c7c8fdf59ddb58812e7036_1.jpg"]

for pic in files:
    try:
        src = 'D:\\HOME\\Workspace\\meiwei-api\\media\\restaurant\\%s' % pic
        dst = 'D:\\HOME\\Workspace\\meiwei-app\\www\\assets\\img\\bootstrap\\restaurant\\%s' % pic
        print src, dst
        shutil.copy(src, dst)
    except:
        print 'fail -- ', src, dst
