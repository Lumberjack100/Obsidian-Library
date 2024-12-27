##  async/await 优点

1. **代码可读性差**
```javascript
// 不使用 async/await (回调地狱)
getUserInfo() {
  global.$http.get('/GetUserByToken').then(res => {
    this.userCompanyID = res.data.companyID;
    global.$http.post('/GetCompanyInfo', {
      companyID: null
    }).then(companyresult => {
      if (companyresult.code == 0) {
        this.projectNumber().then(() => {
          // 更多嵌套...
        });
      }
    });
  });
}

// 使用 async/await (更清晰)
async getUserInfo() {
  const res = await global.$http.get('/GetUserByToken');
  this.userCompanyID = res.data.companyID;
  const companyresult = await global.$http.post('/GetCompanyInfo', {
    companyID: null
  });
  if (companyresult.code == 0) {
    await this.projectNumber();
  }
}
```


2. **错误处理复杂**
```javascript
// 不使用 async/await (多个 catch 块)
startUserLogin() {
  global.$http.post('/SignIn', this.loginParams)
    .then(result => {
      return global.$http.get('/GetUserByToken');
    })
    .catch(err => {
      console.error('登录失败', err);
    })
    .then(userInfo => {
      return global.$http.post('/GetCompanyInfo');
    })
    .catch(err => {
      console.error('获取用户信息失败', err);
    });
}

// 使用 async/await (统一错误处理)
async startUserLogin() {
  try {
    const result = await global.$http.post('/SignIn', this.loginParams);
    const userInfo = await global.$http.get('/GetUserByToken');
    const companyInfo = await global.$http.post('/GetCompanyInfo');
  } catch (error) {
    console.error('操作失败:', error);
  }
}
```

3. **并发控制困难**
```javascript
// 不使用 async/await (难以控制执行顺序)
projectNumber() {
  global.$http.post('/QueryProjectList')
    .then(result => {
      this.onClickItem(result.data[0]); // 可能在其他操作之前执行
    });
  this.someOtherFunction(); // 执行顺序不确定
}

// 使用 async/await (清晰的执行顺序)
async projectNumber() {
  const result = await global.$http.post('/QueryProjectList');
  await this.onClickItem(result.data[0]); // 确保按顺序执行
  await this.someOtherFunction();
}
```


4. **状态管理混乱**
```javascript
// 不使用 async/await (状态可能不同步)
startUserLogin() {
  let userToken;
  global.$http.post('/SignIn', this.loginParams)
    .then(result => {
      userToken = result.data;
      uni.setStorageSync('Authorization', userToken);
    });
  // 这里可能在 token 设置之前执行
  this.doSomethingWithToken();
}

// 使用 async/await (状态同步更新)
async startUserLogin() {
  const result = await global.$http.post('/SignIn', this.loginParams);
  const userToken = result.data;
  uni.setStorageSync('Authorization', userToken);
  // 确保 token 已设置
  await this.doSomethingWithToken();
}
```



5. **调试困难**

- 不使用 async/await 时，错误堆栈可能不完整
- Promise 链中的错误可能被静默处理
- 断点调试时难以跟踪执行流程

总结：
- 虽然不使用 async/await 代码也能工作，但会带来：
- 代码可读性降低
- 错误处理复杂化
- 执行顺序难以控制
- 状态管理困难
- 调试和维护成本增加
  
因此，建议在处理异步操作时使用 async/await 语法，特别是在有多个相互依赖的 API 调用时。