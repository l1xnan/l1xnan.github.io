---
layout: pages
title: Python 进度条神器 tqdm
date: 2018-07-16 17:00:57
tags:
  - Python
categories:
  - Python
---

## 安装

```bash
pip install tqdm
```

演示：

```python
from tqdm import tqdm
for i in tqdm(range(10000)):
    pass
```

<!-- more -->

## 用法

```python
from tqdm import tqdm
text = ""
for char in tqdm(["a", "b", "c", "d"]):
    text = text + char
```

```python
from tqdm import trange
for i in trange(100):
    pass
```

```python
from tqdm import tqdm
pbar = tqdm(["a", "b", "c", "d"])
for char in pbar:
    pbar.set_description("Processing %s" % char)
```

```python
from tqdm import tqdm
with tqdm(total=100) as pbar:
    for i in range(10):
        pbar.update(10)
```

```python
from tqdm import tqdm
pbar = tqdm(total=100)
for i in range(10):
    pbar.update(10)
pbar.close()
```

```python

```
