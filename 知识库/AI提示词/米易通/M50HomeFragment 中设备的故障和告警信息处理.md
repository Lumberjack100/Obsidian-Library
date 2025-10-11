# 请你实现 M50HomeFragment 中设备的故障和告警信息处理


## 具体实现需求
在 M50HomeFragment 中的 initStatusInfo(content: String) 方法中调用 DeviceStatusHelper 工具类中的  DeviceStatusHelper.checkM50Abnormal(content) 方法，实现对 M50 的故障信息进行解析，并返回故障信息列表，调用 DeviceStatusHelper.checkM50Warn(content) 方法，实现对 M50 的告警信息进行解析，并返回告警信息列表。请你优化、实现 DeviceStatusHelper 工具类中的 checkM50Abnormal 和 checkM50Warn 方法，实现对 M50 的故障信息和告警信息进行解析，并返回故障信息列表和告警信息列表，最后将故障信息列表和告警信息列表合并

### 1.checkM50Warn 方法解析字段内容
#### 1.1 光伏板电压，对应 solar_volt 字段
- 光伏板电压数值低于9，则返回告警信息列表中包含 "光伏板电压过低" 的告警信息
#### 1.2 外部电压，对应 ext_power_volt 字段
- 外部电压数值在(0,11]间，则返回告警信息列表中包含 "外部输入电压过低" 的告警信息
- 如果外部电压等于0，不显示告警
#### 1.3 内部电池电量，对应 battery 的列表中的第一个元素的 battery_cap 字段
- 电量数值低于20，则返回告警信息列表中包含 "内部电池电量过低" 的告警信息
#### 1.4 电池健康度，对应 battery 的列表中的第一个元素的 battery_health 字段
- 健康度数值低于80，则返回告警信息列表中包含 "内部电池健康度过低" 的告警信息
#### 1.5 备用电池电量，对应 battery 的列表中的第二个元素的 battery_cap 字段
- 电量数值低于20，则返回告警信息列表中包含 "备用电池电量过低" 的告警信息
#### 1.6 备用电池健康度，对应 battery 的列表中的第二个元素的 battery_health 字段
- 健康度数值低于80，则返回告警信息列表中包含 "备用电池健康度过低" 的告警信息


### 2. 合并故障信息列表和告警信息列表
- 如果内部电池和备用电池已经故障了，则就不用显示内部电池和备用电池的告警信息了


#  M50HomeFragment 中设备的故障和告警信息处理需求变更

## 具体需求
queryStatusInfo() 方法中，新增加 IOTCommandUtil.getCommand(IOTCommandType.SAMPLE)、IOTCommandUtil.getCommand(IOTCommandType.MD_SET_SENSOR_INITIAL, UDInitialValueEntity(method = "0", type = "2").toCommandString())、IOTCommandUtil.getCommand(IOTCommandType.MD_GET_ALRAM_BROADCAST_TRIGGER_VALUE) 三个指令，分别获取 X轴、Y轴、Z轴的 当前角度值、初始角度值、角度触发值，解析处理后得到 X轴、Y轴、Z轴偏移角度的告警信息。

### 1. X轴、Y轴、Z轴偏移角度、角度触发值解析处理
- 参考 M50SensorConfigFragment 中 偏移角度值计算逻辑，计算出 X轴、Y轴、Z轴偏移角度值
- 参考 M50SensorConfigFragment 中 角度触发值解析逻辑，得出 角度触发值
- X轴、Y轴、Z轴的偏移角度值的绝对值大于角度触发值，则返回告警信息列表中包含 "X轴偏移角度过大"、"Y轴偏移角度过大"、"Z轴偏移角度过大" 的告警信息

### 2. 合并故障信息列表和告警信息列表
- 如果倾角加速度模块已经故障了，则就不用显示X轴角度、Y轴角度、Z轴角度告警信息
