# M50AlarmParamSettingFragment 功能实现需求


## 具体实现需求
基于 UDAlarmParamSettingFragment fragment_ud_alarm_param_setting.xml UDAlarmParamSettingViewModel 的代码实现 M50GNSSConfigFragment 、fragment_m50_gnss_config.xml 、M50GNSSConfigViewModel 完整功能


### 1. 将 "报警启用" 改为 "本地报警启用"

### 2. 在 "报警测试" 上方添加 "报警阈值" 区域配置项，包含 "一级报警阈值（毫米）" 、 "二级报警阈值（毫米）"、 "三级报警阈值（毫米）"、 "四级报警阈值（毫米）"  编辑配置项，默认值为 "800"、"400"、"200"、"100"

### 3. 根据设备的状态信息 M50CurrentStateInfo 中 stateInfo.radioEnableStatus == "1" 判断电台模块是否启用
#### 3.1 如果电台模块未启用，则 "报警信息" 、"报警测试" 区域配置项禁用

### 4. 指令
#### 4.1 查询/配置报警阈值指令
| 参数 | 说明 |示例 |备注 |
| - | - |- |- |
| devlevel1 | 一级报警阈值 | 800 | |
| devlevel2 | 二级报警阈值 | 400 | |
| devlevel3 | 三级报警阈值 | 200 | |
| devlevel4 | 四级报警阈值 | 100 | |



``` 查询指令 IOTCommandType.MD_GET_ALRAM_BROADCAST_TRIGGER_VALUE
$cmd=md_getcqgateval
```

``` 响应成功
$cmd=md_getcqgateval&level1=2.000&level2=1.000&level3=1.000&level4=1.000&devlevel1=800.000&devlevel2=400.000&devlevel3=200.000&devlevel4=100.000&apikey=b12aac6b-0bd2-4a01-80fd-97fe4f5d4ff9&msgid=1d9f1

```

``` 响应失败
$cmd=md_getcqgateval&result=fail&reason=type-param_invalid&apikey=95b00bdc-4ecd-4772-aaca-17fd7079decd&msgid=451efc
```

``` 设置指令 IOTCommandType.MD_SET_ALRAM_BROADCAST_REPORT_INTERVAL
$cmd=md_setcqgateval&&devlevel1=800.000&devlevel2=400.000&devlevel3=200.000&devlevel4=100.000
```

``` 响应成功
$cmd=md_setcqgateval&result=succ
```

``` 响应失败
$cmd=md_setcqgateval&result=fail&reason=type-param_invalid&apikey=95b00bdc-4ecd-4772-aaca-17fd7079decd&msgid=451efc
```

