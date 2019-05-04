# vue-mall
> vue + express + mongodb 全栈搭建商城

## 技术栈
- `Vue`
- `Vue-Router`
- `Vuex`
- `Axios`
- `Node`
- `Express`
- `MongoDB`
- `Mongoose`

前端使用 vue-lazyload 图片懒加载 & vue-infinite-scroll 滚动加载  

后端使用 nodemon 热更新

## 项目运行
```bash
# 导入数据到 MongoDB
> mongoimport -d vue_mall -c goods --file './server/resource/vue_mall-goods.json'
> mongoimport -d vue_mall -c users --file './server/resource/vue_mall-users.json'

> cd server && npm install && npm start

> cd mall && npm install && npm start
```
