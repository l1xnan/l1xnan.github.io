---
title: SQLAlchemy & Pandas
tags:
  - pandas
categories:
  - pandas
abbrlink: 31333
date: 2018-10-06 23:36:52
---

做数据分析如果用到了数据库作为数据源，pandas 提供了 `read_sql` 函数，那么如果数据库使用了 `SQLAlchemy` ORM 该怎么利用这个函数呢？
官方文档上说明可以使用，只是说的比较笼统，具体代码如下：
```python
df = pd.read_sql(query.statement, query.session.bind)
```

如果使用的是 `Flask-SQLAlchemy` 则可以为：

```python
df = pd.read_sql(User.query.filter().statement, db.session.bind)
```

参考：[SQLAlchemy ORM conversion to pandas DataFrame](https://stackoverflow.com/questions/29525808/sqlalchemy-orm-conversion-to-pandas-dataframe)
