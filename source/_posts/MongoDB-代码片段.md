---
title: MongoDB 代码片段
tags:
  - MongoDB
  - NoSQL
categories:
  - MongoDB
abbrlink: 39716
date: 2018-07-27 10:24:46
---

## 字段操作

```js
{
    teacher_id: '0001',
    tel: '12345678901',
    details: {
        subject: 'English'
    }
}
```

### 字段重命名

```js
db.teachers.update(
  {},
  { $rename: { 'teacher_id': 'teacherId', 'details.subject': 'details.course' } },
  false,
  true,
);
```

### 字段删除

```js
db.teachers.update({}, { $unset: { mobile: 1 } }, false, true);
```

```js
db.teachers.update({}, { $unset: { 'details.subject': 1 } }, false, true);
```

### 复杂的操作

```js
{
  key: [
    {
      id: 1,
      subkey: value1,
    },
    {
      id: 2,
      subkey: value2,
    },
  ];
}
```

若你只想删除 id 为 1 的的 subkey,你可以使用如下命令:

```js
db.example.update(
  { 'key.id': 1 },
  { $unset: { 'key.$.subkey': 1 } },
  false,
  true,
);
```
