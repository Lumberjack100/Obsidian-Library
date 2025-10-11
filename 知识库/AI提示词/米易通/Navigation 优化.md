## 背景
我的 App 使用了 Navigation Fragment ，我的代码只使用了少量  Activity，相当于单 Activity 多 Fragment 架构，但是会有 Fragment 视图重建的问题，在我的项目中会出现不符合预期的情况，会导致我在 onViewCreated、onResume 等视图生命周期方法中初始化数据的代码重复执行，比如 M50HomeFragment 是M50一体化GNSS监测站设置的配置主页面，包含了蓝牙连接处理、查询设备状态数据、配置设备参数等，当从 M50HomeFragment 跳转到 子页面 时，M50HomeFragment 会执行 onDestroyView 方法，导致重新进行蓝牙连接处理以及其他初始化数据的操作。可以利用 ViewModel 存储状态和数据等方法进行优化，更好的使用 Navigation Fragment。

## 优化需求
目前已经优化实现了 M50HomeViewModel、CommonDeviceHomeViewModel、T_BaseIOTDeviceFragment、T_NetIOTCommandViewModel、T_BleViewModel、T_BaseFragment、T_BaseVmDbFragment，但是 M50HomeFragment 的优化后实现 T_M50HomeFragment 还存在问题，需要继续优化实现。
