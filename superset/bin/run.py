#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/10/17 10:48 上午
# @Author : YanLi
# @File : run.py
# @Software: IntelliJ IDEA


from superset import app

app.run(debug = True, host = "0.0.0.0", port = 8089)