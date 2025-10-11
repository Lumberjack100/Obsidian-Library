
好的，我明白了。Fragment 视图重建导致生命周期方法重复执行，进而引发数据重复初始化（如蓝牙连接、网络请求等）是一个常见的问题。通过将状态和数据管理逻辑迁移到 ViewModel，并正确处理 ViewModel 的生命周期和数据加载时机，可以有效地解决这个问题。

核心思路是将蓝牙连接管理、设备状态数据获取和参数配置等逻辑封装在相应的 ViewModel (`BleViewModel`, `M50HomeViewModel`, `NetIOTCommandViewModel`) 中。Fragment (`M50HomeFragment`) 则主要负责观察 ViewModel 中的数据和状态，并据此更新 UI。初始化操作（如发起连接、加载数据）由 ViewModel 内部控制，确保只在必要时执行一次。

以下是详细的优化方案和步骤：

**1. ViewModel 的职责和生命周期管理：**

*   **`BleViewModel`**:
    *   **职责**: 全权负责蓝牙的扫描、连接、断开、数据发送和接收。
    *   **状态管理**: 维护蓝牙连接的当前状态（例如：`Disconnected`, `Connecting`, `Connected`, `Error`），并通过 `StateFlow` 或 `LiveData` 暴露给观察者。
    *   **数据暴露**: 通过 `SharedFlow` 或 `LiveData` 暴露接收到的蓝牙数据。
    *   **操作**: 提供如 `connect(deviceAddress: String)`、`disconnect()`、`sendCommand(command: ByteArray)` 等方法。这些方法内部需要处理重复调用的情况，例如，如果已经连接或正在连接，则 `connect` 方法不应重复发起连接流程。
    *   **生命周期**: 考虑到蓝牙连接可能需要在多个界面甚至整个应用中保持（例如，即使从 `M50HomeFragment` 导航到子页面，蓝牙连接也应保持），`BleViewModel` 的作用域应该是 `Activity` 级别或通过依赖注入（如 Hilt）实现为 `@Singleton`。它不应该在 `M50HomeFragment` 的视图销毁时断开连接，除非这是业务明确要求的。
*   **`NetIOTCommandViewModel`**:
    *   **职责**: 负责通过网络与设备进行通信、发送指令、接收和解析数据。
    *   **状态管理**: 类似于 `BleViewModel`，管理网络请求的状态（`Loading`, `Success`, `Error`）和结果数据。
    *   **操作**: 提供发起网络请求的方法，并处理请求的幂等性。
    *   **生命周期**: 根据其使用场景，可能是 `Activity` 级别或与特定功能模块的 NavGraph 绑定。
*   **`M50HomeViewModel`**:
    *   **职责**:
        *   协调 `BleViewModel` 和/或 `NetIOTCommandViewModel` 来获取M50设备的数据。
        *   存储 `M50HomeFragment` 所需的设备状态、配置参数等。
        *   处理 `M50HomeFragment` 的业务逻辑，例如，决定何时加载初始数据。
    *   **数据加载**: 提供一个方法（例如 `loadInitialData(deviceAddress: String)`），该方法内部会检查数据是否已加载，如果未加载，则通过 `BleViewModel` 或 `NetIOTCommandViewModel` 获取数据。
    *   **状态暴露**: 通过 `StateFlow` 或 `LiveData` 暴露加载状态和设备数据。
    *   **生命周期**: 通常其作用域应与 `M50HomeFragment` 所在的 NavGraph 绑定 (`navGraphViewModels`)，或者至少与 `M50HomeFragment` 自身绑定 (`viewModels`)。这样，在 Fragment 视图重建时，ViewModel 实例及其数据得以保留。

**2. Fragment (`M50HomeFragment`) 的职责：**

*   **视图初始化**: 在 `onViewCreated` 中初始化视图元素（ViewBinding）。
*   **ViewModel 获取**: 获取所需的 ViewModel 实例 (`M50HomeViewModel`, `BleViewModel` 等)。
*   **数据观察**:
    *   在 `onViewCreated` 中，使用 `viewLifecycleOwner.lifecycleScope.launch` 和 `repeatOnLifecycle(Lifecycle.State.STARTED)` 来安全地收集 ViewModel 中的 `StateFlow` 或观察 `LiveData`。
    *   根据 ViewModel 暴露的状态（如蓝牙连接状态、数据加载状态、设备信息）更新 UI。
*   **触发操作**:
    *   在 `onViewCreated` 中，调用 ViewModel 的方法来触发一次性的初始化操作，例如 `bleViewModel.connect(deviceAddress)` 和 `m50ViewModel.loadInitialDataIfNeeded(deviceAddress)`。ViewModel 内部会处理重复调用的问题。
    *   UI 事件（如按钮点击）应调用 ViewModel 中的相应方法来处理业务逻辑或导航。
*   **生命周期处理**:
    *   **`onResume`**: 通常不需要在此处执行数据加载或连接操作，因为这些应由 ViewModel 管理，并通过 `StateFlow`/`LiveData` 自动更新 UI。
    *   **`onDestroyView`**:
        *   清除对 ViewBinding 的引用以防止内存泄漏。
        *   不需要手动断开蓝牙连接或取消 ViewModel 中的协程，如果 ViewModel 的生命周期管理正确（例如 Activity/NavGraph/Singleton 作用域的 `BleViewModel`，`viewModelScope` 会自动管理协程）。

**3. 基类 (`BaseFragment`, `BaseVmDbFragment`, `BaseIOTDeviceFragment`) 的优化：**

*   **`BaseFragment`**:
    *   可以提供 ViewBinding 的模板代码。
    *   可以提供通用的 `StateFlow` 收集扩展函数，简化错误处理和生命周期管理。
*   **`BaseVmDbFragment`**: 如果它涉及到 ViewModel 和 DataBinding，确保其 ViewModel 的获取方式和生命周期管理与上述原则一致。
*   **`BaseIOTDeviceFragment`**: 如果此类封装了通用的物联网设备交互逻辑，应确保它依赖于 ViewModel (如通用的 `BaseDeviceViewModel` 或具体的 `BleViewModel`/`NetIOTCommandViewModel`) 来管理状态和通信，而不是直接在 Fragment 的生命周期方法中执行这些操作。

**4. Fragment 间通信 (`PageMessenger`)：**

*   如果 `PageMessenger` 用于在 `M50HomeFragment` 和其子页面之间传递数据或结果：
    *   **传递数据到子页面**: 使用 Navigation Component 的 Safe Args。
    *   **从子页面返回结果**: 使用 `setFragmentResultListener` 和 `setFragmentResult`。在 `M50HomeFragment` 的 `onCreate` 或 `onViewCreated` 中注册监听器，在子 Fragment 中设置结果。
    *   **共享复杂状态/数据**: 如果多个 Fragment 需要访问和修改同一份复杂数据，可以考虑使用共享的 ViewModel，其作用域绑定到它们共同的 NavGraph (`navGraphViewModels(R.id.your_nav_graph)`).

**实施步骤和代码查找：**

为了提供具体的代码修改建议，我需要先找到并分析您提到的以下文件：
*   `M50HomeFragment.kt`
*   `M50HomeViewModel.kt`
*   `BaseIOTDeviceFragment.kt` (如果存在且相关)
*   `PageMessenger.kt` (如果存在且相关)
*   `NetIOTCommandViewModel.kt`
*   `BleViewModel.kt`
*   `BaseFragment.kt`
*   `BaseVmDbFragment.kt`

我将使用工具来搜索这些文件。请您确认这些文件的确切路径和命名，如果它们位于特定的模块下，也请告知。例如，`M50HomeFragment` 可能在 `app` 模块的 `src/main/java/...` 目录下。


基于对代码的分析，我现在可以提供一个全面的优化方案，专注于解决 Navigation Fragment 生命周期导致的重复初始化问题。以下是我的方案：

# M50HomeFragment 的 ViewModel 驱动架构优化方案

## 1. 优化 M50HomeViewModel

```kotlin
package com.shmedo.mcloudapp.ui.viewmodel.state

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.shmedo.core.commonlib.jsonhelper.MoshiUtil
import com.shmedo.core.commonlib.utils.AppContants
import com.shmedo.core.model.DeviceInfo
import com.shmedo.lib.ble.scanner.model.DiscoveredBluetoothDevice
import com.shmedo.lib.cmd.base.iot_cmd.enums.IOTCommandType
import com.shmedo.lib.cmd.base.iot_cmd.enums.ProductType
import com.shmedo.lib.cmd.base.iot_cmd.model.gnss_m.M50CurrentStateInfo
import com.shmedo.lib.cmd.base.iot_cmd.parser.IOTCommandResult
import com.shmedo.lib.cmd.base.iot_cmd.utils.IOTCommandUtil
import com.shmedo.mcloudapp.R
import com.shmedo.mcloudapp.model.BleConnect
import com.shmedo.mcloudapp.model.CommunicateWay
import com.shmedo.mcloudapp.model.DeviceStatusEnum
import com.shmedo.mcloudapp.model.NetPlatformConnect
import com.shmedo.mcloudapp.ui.page.base.viewmodel.NonNullObservableField
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import timber.log.Timber

/**
 * 使用 ViewModel 保存状态和业务逻辑，避免 Fragment 重建时重复初始化
 */
class M50HomeViewModel(private val savedStateHandle: SavedStateHandle) : CommonDeviceHomeViewModel() {
    // 原有字段
    val resultantDisplacement = NonNullObservableField(AppContants.PLACE_HOLDER_VALUE)//合位移量
    val xDisplacement = NonNullObservableField(AppContants.PLACE_HOLDER_VALUE)  //x 轴位移量
    val yDisplacement = NonNullObservableField(AppContants.PLACE_HOLDER_VALUE)  //y 轴位移量
    val zDisplacement = NonNullObservableField(AppContants.PLACE_HOLDER_VALUE)  //z 轴位移量
    
    // 新增状态管理字段
    private val _moduleItems = MutableStateFlow<List<Any>>(emptyList())
    val moduleItems: StateFlow<List<Any>> = _moduleItems.asStateFlow()

    // 初始化状态跟踪
    private val _isInitialized = MutableStateFlow(false)
    val isInitialized: StateFlow<Boolean> = _isInitialized.asStateFlow()
    
    // 设备连接状态
    private val _connectionState = MutableStateFlow(false)
    val connectionState: StateFlow<Boolean> = _connectionState.asStateFlow()
    
    // 加载状态
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    // 命令执行状态
    sealed class CommandState {
        object Idle : CommandState()
        object Executing : CommandState()
        data class Success(val result: String) : CommandState()
        data class Error(val message: String) : CommandState()
    }
    
    private val _commandState = MutableStateFlow<CommandState>(CommandState.Idle)
    val commandState: StateFlow<CommandState> = _commandState.asStateFlow()
    
    // 命令队列管理
    private val commandItems = ArrayDeque<String>()
    
    /**
     * 初始化模块数据，只会在第一次调用时执行
     */
    fun initModuleData(productType: ProductType, communicateWay: CommunicateWay) {
        if (_isInitialized.value) return
        
        viewModelScope.launch {
            val groupList = createModuleList(productType, communicateWay)
            _moduleItems.value = groupList
            _isInitialized.value = true
        }
    }
    
    /**
     * 创建模块列表
     */
    private fun createModuleList(productType: ProductType, communicateWay: CommunicateWay): List<Any> {
        // 从原来的 initModuleData() 方法中移过来的逻辑
        // 此处省略具体实现以节省空间
        return emptyList() // 实际实现时返回真实的模块列表
    }
    
    /**
     * 更新连接状态
     */
    fun updateConnectionState(isConnected: Boolean) {
        _connectionState.value = isConnected
        isConnected.set(isConnected)
        
        if (isConnected) {
            productLogoResId.set(R.drawable.device_logo_m50)
            iotPlatformStateText.set("蓝牙已连接")
        } else {
            productLogoResId.set(R.drawable.device_logo_m50_offline)
            iotPlatformStateText.set("蓝牙已断开")
            deviceStatusCode.set(DeviceStatusEnum.UNKNOWN.code)
        }
        
        // 更新模块状态
        refreshModuleStatus(isConnected)
    }
    
    /**
     * 刷新模块状态
     */
    private fun refreshModuleStatus(isConnected: Boolean) {
        // 更新模块连接状态的逻辑
    }
    
    /**
     * 查询设备状态信息
     */
    fun queryStatusInfo(): List<String> {
        val commands = mutableListOf<String>()
        
        commands.add(IOTCommandUtil.getCommand(IOTCommandType.QUERY_DEVICE_STATUS))
        commands.add(IOTCommandUtil.getCommand(IOTCommandType.SAMPLE, "method=0"))
        
        return commands
    }
    
    /**
     * 处理设备状态信息响应
     */
    fun processStatusInfoResponse(content: String) {
        viewModelScope.launch {
            try {
                val stateInfo = withContext(Dispatchers.IO) {
                    MoshiUtil.fromJson<M50CurrentStateInfo>(content)
                } ?: return@launch
                
                val status = when (stateInfo.deviceStatus) {
                    "-2" -> "告警"
                    "-3" -> "故障"
                    else -> "正常"
                }
                
                // 更新 UI 状态
                updateDeviceStatus(status, stateInfo.deviceStatus)
            } catch (e: Exception) {
                Timber.e(e)
            }
        }
    }
    
    /**
     * 更新设备状态
     */
    private fun updateDeviceStatus(status: String, statusCode: String) {
        val logoResId = when(status) {
            "故障" -> R.drawable.device_logo_m50_error
            "告警" -> R.drawable.device_logo_m50_alarm
            else -> R.drawable.device_logo_m50
        }
        
        productLogoResId.set(logoResId)
        deviceStatusCode.set(statusCode)
        warnErrorText.set(status)
    }
    
    /**
     * 处理召测响应
     */
    fun processSampleResponse(content: String) {
        viewModelScope.launch {
            try {
                val resultMap = MoshiUtil.fromJson<Map<String, String>>(content) ?: return@launch
                
                if (resultMap.containsKey("sum_value") &&
                    resultMap.containsKey("x_value") &&
                    resultMap.containsKey("y_value") &&
                    resultMap.containsKey("z_value")) {
                    
                    val resultantDisplacementValue = resultMap["sum_value"]?.let { "$it mm" } 
                        ?: AppContants.PLACE_HOLDER_VALUE
                    val xDisplacementValue = resultMap["x_value"]?.let { "$it mm" }
                        ?: AppContants.PLACE_HOLDER_VALUE
                    val yDisplacementValue = resultMap["y_value"]?.let { "$it mm" }
                        ?: AppContants.PLACE_HOLDER_VALUE
                    val zDisplacementValue = resultMap["z_value"]?.let { "$it mm" }
                        ?: AppContants.PLACE_HOLDER_VALUE
                    
                    resultantDisplacement.set(resultantDisplacementValue)
                    xDisplacement.set(xDisplacementValue)
                    yDisplacement.set(yDisplacementValue)
                    zDisplacement.set(zDisplacementValue)
                }
            } catch (e: Exception) {
                Timber.e(e)
            }
        }
    }
    
    /**
     * 用于在网络平台模式下更新设备在线状态
     */
    fun updateNetPlatformStatus(isOnline: Boolean) {
        if (isOnline) {
            iotPlatformStateText.set("米度平台在线")
        } else {
            productLogoResId.set(R.drawable.device_logo_m50_offline)
            iotPlatformStateText.set("米度平台离线")
            deviceStatusCode.set(DeviceStatusEnum.UNKNOWN.code)
        }
        
        refreshModuleStatus(isOnline)
    }
}
```

## 2. 增强 BleViewModel 以处理连接状态

```kotlin
package com.shmedo.mcloudapp.ui.viewmodel.request

import android.util.Log
import androidx.lifecycle.viewModelScope
import com.shmedo.core.commonlib.mmkv.CommonMMKVOwner
import com.shmedo.core.data.repository.LoggerRepositoryImp
import com.shmedo.lib.ble.communicate.data.CommandData
import com.shmedo.lib.ble.communicate.service.MedoBleRepository
import com.shmedo.lib.ble.communicate.service.base.BleManagerResult
import com.shmedo.lib.ble.communicate.service.base.ConnectedResult
import com.shmedo.lib.ble.communicate.service.base.ConnectingResult
import com.shmedo.lib.ble.communicate.service.base.DisconnectedResult
import com.shmedo.lib.ble.communicate.service.base.IdleResult
import com.shmedo.lib.ble.communicate.service.base.LinkLossResult
import com.shmedo.lib.ble.communicate.service.base.MissingServiceResult
import com.shmedo.lib.ble.communicate.service.base.ReadyResult
import com.shmedo.lib.ble.communicate.service.base.SuccessResult
import com.shmedo.lib.ble.communicate.service.base.UnknownErrorResult
import com.shmedo.lib.ble.scanner.model.DiscoveredBluetoothDevice
import com.shmedo.lib.cmd.base.md_cmd.utils.MDConstants
import com.shmedo.mcloudapp.model.MedoViewState
import com.shmedo.mcloudapp.model.WorkingState
import com.shmedo.mcloudapp.ui.page.base.viewmodel.BaseRequestViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import java.util.UUID

class BleViewModel(
    private val medoBleRepository: MedoBleRepository,
    loggerRepositoryImp: LoggerRepositoryImp
) : BaseRequestViewModel(loggerRepositoryImp) {

    private val _state: MutableSharedFlow<MedoViewState> = MutableSharedFlow()
    val state = _state.asSharedFlow()
    
    // 增加连接状态追踪
    private val _connectionState = MutableStateFlow(false)
    val connectionState: StateFlow<Boolean> = _connectionState.asStateFlow()
    
    // 蓝牙设备信息
    private val _currentDevice = MutableStateFlow<DiscoveredBluetoothDevice?>(null)
    val currentDevice: StateFlow<DiscoveredBluetoothDevice?> = _currentDevice.asStateFlow()
    
    // 命令响应结果
    data class CommandResponse(val command: String, val response: String)
    private val _commandResponse = MutableSharedFlow<CommandResponse>()
    val commandResponse = _commandResponse.asSharedFlow()

    init {
        medoBleRepository.data.onEach {
            logResult(it)
            _state.emit(WorkingState(it))
            
            // 更新连接状态
            when (it) {
                is ReadyResult -> _connectionState.value = true
                is DisconnectedResult, is LinkLossResult, is MissingServiceResult, is UnknownErrorResult -> 
                    _connectionState.value = false
                is SuccessResult -> {
                    viewModelScope.launch {
                        _commandResponse.emit(CommandResponse("", it.data.response))
                    }
                }
                else -> {}
            }
        }.launchIn(viewModelScope)
    }

    fun launch(device: DiscoveredBluetoothDevice) {
        _currentDevice.value = device
        
        // 如果已经连接，不要重复连接
        if (_connectionState.value) return
        
        medoBleRepository.launch(device)
    }

    fun disconnect() {
        medoBleRepository.disconnect()
        _currentDevice.value = null
    }

    fun isConnected(): Boolean {
        return _connectionState.value
    }

    // 其余方法保持不变...
}
```

## 3. 优化 NetIOTCommandViewModel 实现状态管理和幂等性

```kotlin
package com.shmedo.mcloudapp.ui.viewmodel.request

import androidx.lifecycle.viewModelScope
import com.shmedo.core.commonlib.jsonhelper.MoshiUtil
import com.shmedo.core.data.repository.DeviceInteractiveRepositoryImp
import com.shmedo.core.data.repository.LoggerRepositoryImp
import com.shmedo.core.model.DispatchCmdItem
import com.shmedo.core.model.DispatchRawCmdParam
import com.shmedo.core.model.QueryCmdResult
import com.shmedo.core.model.QueryCmdResultParam
import com.shmedo.lib.network.ext.errorMsg
import com.shmedo.mcloudapp.model.CmdDispatch
import com.shmedo.mcloudapp.model.CmdResponseResultError
import com.shmedo.mcloudapp.model.CmdResponseResultSuccess
import com.shmedo.mcloudapp.model.CmdResponseResultTimeOut
import com.shmedo.mcloudapp.model.DispatchFailed
import com.shmedo.mcloudapp.model.DispatchSuccess
import com.shmedo.mcloudapp.ui.page.base.viewmodel.BaseRequestViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import timber.log.Timber

class NetIOTCommandViewModel(
    private val deviceInteractiveRepositoryImp: DeviceInteractiveRepositoryImp,
    loggerRepositoryImp: LoggerRepositoryImp
) : BaseRequestViewModel(loggerRepositoryImp) {
    private val _cmdDispatchFlow: MutableSharedFlow<CmdDispatch> = MutableSharedFlow()
    val cmdDispatchFlow = _cmdDispatchFlow.asSharedFlow()

    private var msgIDList: ArrayList<String> = ArrayList()
    
    // 添加加载状态
    sealed class LoadingState {
        object Idle : LoadingState()
        object Loading : LoadingState()
        object Success : LoadingState()
        data class Error(val message: String) : LoadingState()
    }
    
    private val _loadingState = MutableStateFlow<LoadingState>(LoadingState.Idle)
    val loadingState: StateFlow<LoadingState> = _loadingState.asStateFlow()
    
    // 当前执行的命令作业，用于避免重复执行
    private var currentCommandJob: Job? = null
    
    // 命令队列，保存待执行的命令
    private val commandQueue = ArrayDeque<Pair<String, List<String>>>()
    
    // 正在执行的命令
    private val _activeCommand = MutableStateFlow<String?>(null)
    val activeCommand: StateFlow<String?> = _activeCommand.asStateFlow()
    
    /**
     * 发送命令，如果已有命令在执行，则将命令加入队列
     */
    fun batchDispatchRawCmd(
        content: String,
        deviceTokenList: List<String>
    ) {
        // 如果相同命令正在执行，则跳过
        if (_activeCommand.value == content) return
        
        // 将命令加入队列
        commandQueue.add(Pair(content, deviceTokenList))
        
        // 如果没有命令在执行，则开始执行
        if (currentCommandJob == null) {
            executeNextCommand()
        }
    }
    
    /**
     * 执行队列中的下一个命令
     */
    private fun executeNextCommand() {
        if (commandQueue.isEmpty()) {
            _activeCommand.value = null
            return
        }
        
        val (content, deviceTokenList) = commandQueue.removeFirst()
        _activeCommand.value = content
        
        currentCommandJob = viewModelScope.launch {
            _loadingState.value = LoadingState.Loading
            
            try {
                val rawCmdParam = DispatchRawCmdParam(content, deviceTokenList)
                val jsonParam = MoshiUtil.toJson(rawCmdParam)
                val data: List<DispatchCmdItem> =
                    deviceInteractiveRepositoryImp.batchDispatchRawCmd(jsonParam)

                msgIDList.clear()
                msgIDList.addAll(data.map { it.msgID })
                _cmdDispatchFlow.emit(DispatchSuccess(content))
                
                // 处理命令结果
                processCmdResult(content)
                
            } catch (error: Throwable) {
                Timber.e(error)
                _loadingState.value = LoadingState.Error(error.errorMsg)
                _cmdDispatchFlow.emit(DispatchFailed(content, error.errorMsg))
                
                // 执行下一个命令
                currentCommandJob = null
                executeNextCommand()
            }
        }
    }

    fun processCmdResult(cmdStr: String = "", otherMsgIDList: ArrayList<String> = arrayListOf()) {
        viewModelScope.launch {
            try {
                val parameter =
                    QueryCmdResultParam(if (otherMsgIDList.isEmpty()) msgIDList else otherMsgIDList)
                pollForCommandResult(cmdStr = cmdStr, jsonParam = MoshiUtil.toJson(parameter))
            } catch (error: Exception) {
                Timber.e(error)
                _loadingState.value = LoadingState.Error(error.message ?: "Error")
                
                // 错误处理
                _cmdDispatchFlow.emit(
                    CmdResponseResultError(
                        cmdStr = cmdStr,
                        errorMsg = error.message ?: "Error"
                    )
                )
                
                // 命令完成，执行下一个
                currentCommandJob = null
                executeNextCommand()
            }
        }
    }

    /**
     * 轮询指令响应结果 10次
     */
    private suspend fun pollForCommandResult(cmdStr: String = "", jsonParam: String) {
        repeat(20) {
            delay(500) //延迟 500 毫秒
            val cmdResult: QueryCmdResult = queryCmdResultByMsgID(jsonParam)
            if (cmdResult.cmdStatus == 2) {
                _loadingState.value = LoadingState.Success
                _cmdDispatchFlow.emit(CmdResponseResultSuccess(cmdResult))
                
                // 命令完成，执行下一个
                currentCommandJob = null
                executeNextCommand()
                return
            }
        }
        _loadingState.value = LoadingState.Error("Command timed out")
        _cmdDispatchFlow.emit(CmdResponseResultTimeOut(cmdStr))
        
        // 命令完成，执行下一个
        currentCommandJob = null
        executeNextCommand()
        return
    }

    /**
     * 查询设备对下发/透传的指令响应结果的逻辑
     */
    private suspend fun queryCmdResultByMsgID(jsonParam: String): QueryCmdResult {
        return withContext(Dispatchers.IO) {
            // 查询设备对下发/透传的指令响应结果的逻辑
            val data: List<QueryCmdResult> =
                deviceInteractiveRepositoryImp.queryCmdResultByMsgID(jsonParam)
            val queryCmdResult = data[0]
            queryCmdResult
        }
    }
    
    /**
     * 取消当前命令
     */
    fun cancelCurrentCommand() {
        currentCommandJob?.cancel()
        currentCommandJob = null
        _activeCommand.value = null
        _loadingState.value = LoadingState.Idle
        
        // 执行下一个命令
        executeNextCommand()
    }
    
    /**
     * 清空命令队列
     */
    fun clearCommandQueue() {
        commandQueue.clear()
    }
}
```

## 4. 优化 PageMessenger 用于 Fragment 间通信

```kotlin
package com.shmedo.mcloudapp.ui.viewmodel.state

import androidx.lifecycle.ViewModel
import com.kunminx.architecture.domain.message.MutableResult
import com.kunminx.architecture.domain.message.Result
import com.shmedo.mcloudapp.model.CustomActivityResult
import com.shmedo.mcloudapp.model.MRPortSensorRefreshResult
import com.shmedo.mcloudapp.ui.page.base.viewmodel.NonNullObservableField
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow

class PageMessenger : ViewModel() {
    // 原有字段保留...
    
    // 添加新的 Flow 来实现 Fragments 之间的通信
    
    // 设备状态更新
    data class DeviceStatusUpdate(val deviceToken: String, val isOnline: Boolean)
    private val _deviceStatusUpdate = MutableSharedFlow<DeviceStatusUpdate>()
    val deviceStatusUpdate: SharedFlow<DeviceStatusUpdate> = _deviceStatusUpdate.asSharedFlow()
    
    // 命令执行结果
    data class CommandResult(val command: String, val success: Boolean, val message: String)
    private val _commandResult = MutableSharedFlow<CommandResult>()
    val commandResult: SharedFlow<CommandResult> = _commandResult.asSharedFlow()
    
    // Fragment 导航回调
    data class NavigationEvent(val fragmentId: Int, val args: Map<String, Any>? = null)
    private val _navigationEvent = MutableSharedFlow<NavigationEvent>()
    val navigationEvent: SharedFlow<NavigationEvent> = _navigationEvent.asSharedFlow()
    
    // M50特定的设备状态更新
    data class M50DeviceState(
        val deviceStatus: String,
        val warningText: String,
        val displacement: Map<String, String>
    )
    private val _m50DeviceState = MutableStateFlow<M50DeviceState?>(null)
    val m50DeviceState: StateFlow<M50DeviceState?> = _m50DeviceState.asStateFlow()
    
    // 用于更新设备状态的函数
    suspend fun updateDeviceStatus(deviceToken: String, isOnline: Boolean) {
        _deviceStatusUpdate.emit(DeviceStatusUpdate(deviceToken, isOnline))
    }
    
    // 用于发送命令执行结果的函数
    suspend fun emitCommandResult(command: String, success: Boolean, message: String = "") {
        _commandResult.emit(CommandResult(command, success, message))
    }
    
    // 用于发送导航事件的函数
    suspend fun navigate(fragmentId: Int, args: Map<String, Any>? = null) {
        _navigationEvent.emit(NavigationEvent(fragmentId, args))
    }
    
    // 用于更新M50设备状态
    fun updateM50DeviceState(status: String, warning: String, displacement: Map<String, String>) {
        _m50DeviceState.value = M50DeviceState(status, warning, displacement)
    }
}
```

## 5. 优化 M50HomeFragment 的实现

```kotlin
package com.shmedo.mcloudapp.ui.page.device.m50.fragment

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.blankj.utilcode.util.ConvertUtils
import com.blankj.utilcode.util.StringUtils
import com.drake.brv.utils.linear
import com.drake.brv.utils.models
import com.drake.brv.utils.setup
import com.hjq.toast.Toaster
import com.kunminx.architecture.ui.page.DataBindingConfig
import com.shmedo.lib.cmd.base.iot_cmd.enums.IOTCommandType
import com.shmedo.lib.cmd.base.iot_cmd.enums.ProductType
import com.shmedo.lib.cmd.base.iot_cmd.parser.IOTCommandResult
import com.shmedo.lib.cmd.base.iot_cmd.parser.IOTParserManager
import com.shmedo.lib.cmd.base.iot_cmd.utils.IOTCommandUtil
import com.shmedo.mcloudapp.BR
import com.shmedo.mcloudapp.R
import com.shmedo.mcloudapp.baseclickproxy.BaseClickProxy
import com.shmedo.mcloudapp.baseclickproxy.DoubleClickListener
import com.shmedo.mcloudapp.databinding.FragmentM50HomeBinding
import com.shmedo.mcloudapp.databinding.ItemSubConfigModuleBinding
import com.shmedo.mcloudapp.extensions.dismissLoadingDialog
import com.shmedo.mcloudapp.extensions.nav
import com.shmedo.mcloudapp.extensions.registerOnBackPressedDispatcher
import com.shmedo.mcloudapp.extensions.safeNavigate
import com.shmedo.mcloudapp.extensions.showDialogFragment
import com.shmedo.mcloudapp.extensions.showLoadingDialog
import com.shmedo.mcloudapp.extensions.showMessage
import com.shmedo.mcloudapp.model.BleConnect
import com.shmedo.mcloudapp.model.ConfigModule
import com.shmedo.mcloudapp.model.ConfigModuleTree
import com.shmedo.mcloudapp.model.DeviceFunctionModule
import com.shmedo.mcloudapp.model.GapItem
import com.shmedo.mcloudapp.model.NetPlatformConnect
import com.shmedo.mcloudapp.ui.page.device.BaseIOTDeviceFragment
import com.shmedo.mcloudapp.ui.page.device.u_product.dialog.FindDeviceBeepDialog
import com.shmedo.mcloudapp.ui.viewmodel.request.DeviceRequestViewModel
import com.shmedo.mcloudapp.ui.viewmodel.state.M50HomeViewModel
import com.shmedo.mcloudapp.ui.viewmodel.state.ToolbarViewModel
import com.shmedo.mcloudapp.ui.widget.recyclerview.MyGridSpacingItemDecoration
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import org.koin.android.ext.android.inject
import org.koin.androidx.viewmodel.ext.android.viewModel
import timber.log.Timber

/**
 * M50 首页 - 优化版本
 * 核心改进：使用ViewModel管理状态，避免Fragment视图重建导致的重复初始化
 */
class M50HomeFragment : BaseIOTDeviceFragment() {
    private lateinit var binding: FragmentM50HomeBinding
    private val toolbarViewModel: ToolbarViewModel by viewModels()
    private val m50ViewModel: M50HomeViewModel by viewModels()
    private val deviceRequestViewModel: DeviceRequestViewModel by viewModel()
    private val iotParseManager: IOTParserManager by inject()
    
    // 使用 activityViewModels() 确保与Activity生命周期绑定，避免Fragment重建时丢失
    private val bleActivityViewModel: BleViewModel by activityViewModels()

    override fun initViewModel() {
        super.initViewModel()
    }

    override fun getDataBindingConfig(): DataBindingConfig {
        return DataBindingConfig(R.layout.fragment_m50_home, BR.stateVM, m50ViewModel)
            .addBindingParam(BR.toolbarVM, toolbarViewModel)
            .addBindingParam(BR.click, ClickProxy())
    }

    override fun initView(savedInstanceState: Bundle?) {
        binding = getBinding() as FragmentM50HomeBinding
        binding.llToolbar.toolbar.title = "返回"
        binding.llToolbar.toolbar.setNavigationOnClickListener {
            if (bleViewModel.isConnected()) {
                bleViewModel.disconnect()
            }
            mActivity.finish()
        }
        registerOnBackPressedDispatcher {
            if (bleViewModel.isConnected()) {
                bleViewModel.disconnect()
            }
            mActivity.finish()
        }
        initDeviceLogoDoubleClickListener()
        initModuleAdapter()
    }

    private fun initDeviceLogoDoubleClickListener() {
        binding.llDeviceInfo.ivDeviceLogo.setOnClickListener(object : DoubleClickListener() {
            override fun onDoubleClick(v: View) {
                if (isBleDisconnected() || isNetDisconnected()) {
                    return
                }
                searchDevice()
            }
        })
    }

    override fun initData() {
        super.initData()
        // 基本数据设置，一次性初始化，不需要在每次视图重建时执行
        m50ViewModel.productLogoResId.set(R.drawable.device_logo_m50)
        m50ViewModel.productName.set(productType.productName)
        m50ViewModel.productToken.set(productType.productToken)
        m50ViewModel.deviceToken.set(deviceInfo.deviceToken)

        when (communicateWay) {
            NetPlatformConnect -> {
                toolbarViewModel.toolbarIvActionVisible.set(false)
            }
            BleConnect -> {
                toolbarViewModel.toolbarIvActionResId.set(R.drawable.ic_ble_connect)
                toolbarViewModel.toolbarIvActionVisible.set(true)
            }
            else -> {}
        }

        // 使用ViewModel初始化模块数据，确保只执行一次
        m50ViewModel.initModuleData(productType, communicateWay)
    }
    
    override fun createObserver() {
        super.createObserver()
        
        // 观察列表数据并设置
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                m50ViewModel.moduleItems.collectLatest { items ->
                    if (items.isNotEmpty()) {
                        binding.rvModule.models = items
                    }
                }
            }
        }
        
        // 观察蓝牙连接状态
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                bleActivityViewModel.connectionState.collectLatest { isConnected ->
                    m50ViewModel.updateConnectionState(isConnected)
                }
            }
        }
        
        // 观察命令响应
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                bleActivityViewModel.commandResponse.collectLatest { response ->
                    handleCommandResponse(response.command, response.response)
                }
            }
        }
        
        // 处理网络平台设备状态检查
        if (communicateWay is NetPlatformConnect) {
            setupDeviceStatusCheck()
        }
    }
    
    /**
     * 处理命令响应
     */
    private fun handleCommandResponse(command: String, response: String) {
        when (IOTCommandUtil.extractCommandType(response)) {
            IOTCommandType.QUERY_DEVICE_STATUS -> {
                val result = iotParseManager.parse<String>(response, IOTCommandType.QUERY_DEVICE_STATUS)
                when (result) {
                    is IOTCommandResult.Success -> {
                        m50ViewModel.processStatusInfoResponse(result.data)
                    }
                    is IOTCommandResult.Failure -> {
                        Timber.e("查询设备状态出错: ${result.message}")
                    }
                }
            }
            IOTCommandType.SAMPLE -> {
                val result = iotParseManager.parse<String>(response, IOTCommandType.SAMPLE)
                when (result) {
                    is IOTCommandResult.Success -> {
                        m50ViewModel.processSampleResponse(result.data)
                    }
                    is IOTCommandResult.Failure -> {
                        Timber.e("召测出错: ${result.message}")
                    }
                }
            }
            IOTCommandType.MD_SEARCH_DEVICE -> {
                showDialogFragment(FindDeviceBeepDialog.TAG) {
                    FindDeviceBeepDialog.newInstance(ProductType.GNSS_M_5)
                }
            }
            else -> {}
        }
    }
    
    /**
     * 设置设备状态检查
     */
    private fun setupDeviceStatusCheck() {
        viewLifecycleOwner.lifecycleScope.launch {
            deviceRequestViewModel.deviceStatusFlow.collectLatest { deviceInfo ->
                // 仅当设备在线状态发生变化时更新UI
                val isOnlineChanged = deviceInfo.onlineStatus != this@M50HomeFragment.deviceInfo.onlineStatus
                if (isOnlineChanged) {
                    this@M50HomeFragment.deviceInfo = deviceInfo
                    m50ViewModel.updateNetPlatformStatus(deviceInfo.onlineStatus)
                    
                    if (deviceInfo.onlineStatus) {
                        // 仅在设备在线且状态变化时查询状态
                        queryStatusInfo()
                    }
                }
            }
        }
    }

    private fun initModuleAdapter() {
        binding.rvModule.linear().setup { rv ->
            addType<DeviceStatusInfoGroupItem>(R.layout.item_device_status_info_group2)
            addType<ConfigModuleTree>(R.layout.item_sub_config_module)
            addType<GapItem>(R.layout.item_device_status_info_gap)
            onCreate {
                when (itemViewType) {
                    R.layout.item_sub_config_module -> {
                        val itemBinding = getBinding<ItemSubConfigModuleBinding>()
                        itemBinding.rvSubModule.setup { subRv ->
                            subRv.addItemDecoration(
                                MyGridSpacingItemDecoration(
                                    4,
                                    ConvertUtils.dp2px(10f), false
                                )
                            )
                            addType<ConfigModule>(R.layout.item_device_config_module_ud)
                            R.id.item.onClick {
                                val configModule = getModel<ConfigModule>()
                                processSubModuleItemClick(configModule.functionModule)
                            }
                        }
                    }
                    else -> {}
                }
            }
            onBind {
                when (itemViewType) {
                    R.layout.item_sub_config_module -> {
                        val configModuleTree = getModel<ConfigModuleTree>()
                        val itemBinding = getBinding<ItemSubConfigModuleBinding>()
                        itemBinding.rvSubModule.models = configModuleTree

                        itemBinding.rvSubModule.models = configModuleTree.configModules
                    }
                    else -> {}
                }
            }
        }
    }

    override fun onConnectionStateChanged(isConnected: Boolean) {
        // 这个方法现在由 ViewModel 处理，不需要具体实现
        // m50ViewModel 会监听 bleActivityViewModel 的连接状态
    }

    inner class ClickProxy : BaseClickProxy() {
        override fun onToolbarIvClick() {
            if (bleViewModel.isConnected()) {
                showMessage(
                    StringUtils.getString(R.string.disconnect_device_warn),
                    "温馨提示",
                    "确定",
                    {
                        bleViewModel.disconnect()
                    },
                    "取消"
                )
            } else {
                // 使用 bleActivityViewModel 来确保连接状态在 Fragment 重建后保持
                bleActivityViewModel.launch(bleDevice!!)
            }
        }

        fun onGotoLocationClick() {
            if (isBleDisconnected()) {
                Toaster.show(StringUtils.getString(R.string.ble_config_disconnect_warn))
                return
            }
            nav().safeNavigate(
                R.id.action_global_to_udLocationInfoFragment,
                newBundleArguments(
                    productType,
                    communicateWay,
                    deviceInfo,
                    bleDevice
                )
            )
        }

        fun onTakePhotoClick() {
            if (isBleDisconnected()) {
                Toaster.show(StringUtils.getString(R.string.ble_config_disconnect_warn))
                return
            }
            takePhoto()
        }

        fun onGoToSensorDataHistoryClick() {
            nav().safeNavigate(
                R.id.action_global_to_udMonitorDataHistoryFragment,
                UDSensorDataHistoryFragment.Companion.newBundleArguments(productType, deviceInfo)
            )
        }
    }

    private fun processSubModuleItemClick(module: DeviceFunctionModule) {
        if (isBleDisconnected()) {
            Toaster.show(StringUtils.getString(R.string.ble_config_disconnect_warn))
            return
        }
        when (module) {
            is DataCenterModule -> {
                nav().safeNavigate(
                    module.navId,
                    UniversalDataCenterHomeFragment.Companion.newBundleArguments(
                        centerNum = 4,
                        productType,
                        communicateWay,
                        deviceInfo,
                        bleDevice
                    )
                )
            }
            is CommandDebugConfigModule -> {//指令下发
                val bundle = BleCustomCommandLogPrintFragment.Companion.newBundleArguments(
                    true,
                    productType,
                    communicateWay,
                    deviceInfo,
                    bleDevice
                )
                nav().safeNavigate(module.navId, bundle)
            }
            else -> {
                if (module.navId != 0) {
                    val bundle = newBundleArguments(
                        productType,
                        communicateWay,
                        deviceInfo,
                        bleDevice
                    )
                    nav().safeNavigate(
                        module.navId,
                        bundle
                    )
                } else {
                    Toaster.show("正在开发中")
                }
            }
        }
    }

    private fun queryStatusInfo() {
        // 使用 ViewModel 获取命令列表，而不是直接创建
        val commands = m50ViewModel.queryStatusInfo()
        
        if (communicateWay is NetPlatformConnect) {
            // 对于网络平台连接，我们使用 NetIOTCommandViewModel
            commands.forEach { command ->
                netIotCommandViewModel.batchDispatchRawCmd(command, listOf(deviceInfo.deviceToken))
            }
        } else {
            // 对于蓝牙连接，我们使用 BleViewModel
            commands.forEach { command ->
                bleViewModel.sendIOTCommand(command, deviceInfo.apikey)
            }
        }
    }

    /**
     * 拍照
     */
    private fun takePhoto() {
        val command = IOTCommandUtil.getCommand(IOTCommandType.SAMPLE, "method=1")
        
        showLoadingDialog(StringUtils.getString(R.string.processing))
        
        if (communicateWay is NetPlatformConnect) {
            netIotCommandViewModel.batchDispatchRawCmd(command, listOf(deviceInfo.deviceToken))
        } else {
            bleViewModel.sendIOTCommand(command, deviceInfo.apikey)
        }
    }

    override fun lazyLoadData() {
        // 这个方法由视图加载一次性调用
        if (communicateWay is NetPlatformConnect) {
            // 对于网络连接，检查设备状态
            if (deviceInfo.onlineStatus) {
                m50ViewModel.updateNetPlatformStatus(true)
                queryStatusInfo()
            } else {
                m50ViewModel.updateNetPlatformStatus(false)
            }
        } else {
            // 对于蓝牙连接，我们检查是否已经连接
            if (!bleActivityViewModel.isConnected()) {
                bleActivityViewModel.launch(bleDevice!!)
            } else {
                // 如果已经连接，直接查询状态
                queryStatusInfo()
            }
        }
    }

    override fun onBleDeviceReady() {
        // 只有在蓝牙设备第一次准备好时查询状态
        // 由于我们使用了 activityViewModels 绑定的 BleViewModel，
        // 连接状态会在 Fragment 重建后保持，只有在真正需要时才会查询
        if (!m50ViewModel.isInitialized.value) {
            queryStatusInfo()
        }
    }

    override fun setResultData(cmdStr: String) {
        // 这个方法现在会通过 BleViewModel 和 NetIOTCommandViewModel 的流处理
        // 在 createObserver() 中已经设置了观察者
    }

    override fun onResume() {
        super.onResume()
        initImmersionBar(binding.llToolbar.toolbar)
        
        // 在 onResume 中检查连接状态，但不重新执行初始化逻辑
        if (bleViewModel.isConnected() && communicateWay is BleConnect) {
            m50ViewModel.updateConnectionState(true)
        } else if (communicateWay is NetPlatformConnect) {
            m50ViewModel.updateNetPlatformStatus(deviceInfo.onlineStatus)
        }
    }

    override fun onDestroyView() {
        // 在 onDestroyView 中清除对 ViewBinding 的引用
        // 但不需要取消 ViewModel 中的任务，因为它们与 ViewModel 的生命周期相关联
        super.onDestroyView()
    }
}
```

## 6. 优化 BaseIOTDeviceFragment

```kotlin
package com.shmedo.mcloudapp.ui.page.device

import android.os.Bundle
import android.util.Log
import androidx.annotation.CallSuper
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.blankj.utilcode.util.StringUtils
import com.drake.brv.PageRefreshLayout
import com.hjq.toast.ToastParams
import com.hjq.toast.Toaster
import com.shmedo.core.commonlib.mmkv.CommonMMKVOwner
import com.shmedo.core.commonlib.utils.AppContants
import com.shmedo.core.model.DeviceInfo
import com.shmedo.lib.ble.scanner.model.DiscoveredBluetoothDevice
import com.shmedo.lib.cmd.base.iot_cmd.enums.ProductType
import com.shmedo.lib.cmd.base.iot_cmd.utils.IOTCommandUtil
import com.shmedo.mcloudapp.R
import com.shmedo.mcloudapp.extensions.dismissLoadingDialog
import com.shmedo.mcloudapp.extensions.getAppViewModel
import com.shmedo.mcloudapp.extensions.nav
import com.shmedo.mcloudapp.extensions.showLoadingDialog
import com.shmedo.mcloudapp.extensions.showMessage
import com.shmedo.mcloudapp.extensions.showMessageDialog
import com.shmedo.mcloudapp.model.BleConnect
import com.shmedo.mcloudapp.model.CommunicateWay
import com.shmedo.mcloudapp.model.NetPlatformConnect
import com.shmedo.mcloudapp.ui.page.base.fragment.BaseFragment
import com.shmedo.mcloudapp.ui.viewmodel.request.BleViewModel
import com.shmedo.mcloudapp.ui.viewmodel.request.NetIOTCommandViewModel
import com.shmedo.mcloudapp.ui.viewmodel.state.PageMessenger
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.launch
import org.koin.androidx.viewmodel.ext.android.getViewModel
import timber.log.Timber

/**
 * 创建者:   gonghe <br/>
 * 创建时间:  2023/9/20 <br/>
 * 描述：    IOT 设备基础 Fragment，优化以支持 ViewModel 驱动的架构
 */
abstract class BaseIOTDeviceFragment : BaseFragment() {
    protected lateinit var mMessenger: PageMessenger
    protected lateinit var netIotCommandViewModel: NetIOTCommandViewModel
    protected lateinit var bleViewModel: BleViewModel
    
    // 使用 activityViewModels 确保与 Activity 生命周期绑定，避免 Fragment 重建时丢失连接状态
    protected val bleActivityViewModel: BleViewModel by activityViewModels()

    protected var refreshLayout: PageRefreshLayout? = null

    protected var productType = ProductType.UnKnown
    protected var statusBarColor = 0
    protected var communicateWay: CommunicateWay = NetPlatformConnect
    protected lateinit var deviceInfo: DeviceInfo
    protected var bleDevice: DiscoveredBluetoothDevice? = null

    // 使用 StateFlow 跟踪最后通信时间
    protected val lastCommunicationTime = MutableStateFlow(System.currentTimeMillis())

    // 更新最后通信时间
    protected fun updateLastCommunicationTime() {
        lastCommunicationTime.value = System.currentTimeMillis()
    }

    @CallSuper
    override fun initViewModel() {
        mMessenger = getAppViewModel()
        netIotCommandViewModel = getViewModel()
        bleViewModel = getViewModel()
    }

    @CallSuper
    override fun initData() {
        arguments?.let {
            productType = it.getParcelable(AppContants.Extras.PRODUCT_TYPE)!!
            communicateWay = it.getParcelable(AppContants.Extras.COMMUNICATION_WAY)!!
            deviceInfo = it.getParcelable(AppContants.Extras.DEVICE_INFO)!!
            bleDevice = it.getParcelable(AppContants.Extras.BLE_DEVICE)
            statusBarColor = it.getInt(AppContants.Extras.STATUS_BAR_COLOR)
        }
    }

    @CallSuper
    override fun createObserver() {
        // 观察网络命令结果
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                netIotCommandViewModel.cmdDispatchFlow.collectLatest { cmdDispatch ->
                    // 处理命令派发结果
                    // 具体逻辑由子类实现
                }
            }
        }
        
        // 观察蓝牙连接状态
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                bleActivityViewModel.connectionState.collectLatest { isConnected ->
                    onConnectionStateChanged(isConnected)
                    
                    if (isConnected) {
                        onBleDeviceReady()
                    }
                }
            }
        }
        
        // 观察蓝牙命令响应
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                bleActivityViewModel.commandResponse
                    .filter { communicateWay is BleConnect }
                    .collectLatest { response ->
                        updateLastCommunicationTime()
                        setResultData(response.response)
                    }
            }
        }
    }

    // 连接状态变化回调
    open fun onConnectionStateChanged(isConnected: Boolean) {}

    // 蓝牙设备准备就绪回调
    open fun onBleDeviceReady() {
        dismissLoadingDialog()
    }

    // 处理命令结果数据
    abstract fun setResultData(cmdStr: String)

    // 发送蓝牙命令
    protected fun sendBleCommand(command: String, delaySendMillis: Long = 0) {
        addDeviceLogItem(Log.DEBUG, "ble 发送指令: $command")
        bleActivityViewModel.sendIOTCommand(command, deviceInfo.apikey, delaySendMillis)
    }

    // 检查蓝牙是否断开
    protected fun isBleDisconnected() = 
        communicateWay is BleConnect && !bleActivityViewModel.isConnected()

    // 检查网络是否断开
    protected fun isNetDisconnected() =
        communicateWay is NetPlatformConnect && !deviceInfo.onlineStatus

    // 处理失败结果
    protected fun handleFailureResult(
        errMsg: String, isShowErrMsg: Boolean = true, isMessageDialog: Boolean = false
    ) {
        Timber.e(errMsg)
        if (isShowErrMsg) {
            if (isMessageDialog) showMessageDialog(errMsg)
            else Toaster.show(errMsg)
        }
    }

    /**
     * 查找设备
     */
    protected open fun searchDevice() {
        val command = IOTCommandUtil.getCommand(IOTCommandType.MD_SEARCH_DEVICE, "switch=1")
        
        showLoadingDialog(StringUtils.getString(R.string.device_searching))
        
        if (communicateWay is NetPlatformConnect) {
            netIotCommandViewModel.batchDispatchRawCmd(command, listOf(deviceInfo.deviceToken))
        } else {
            bleActivityViewModel.sendIOTCommand(command, deviceInfo.apikey)
        }
    }

    // 添加设备日志
    fun addDeviceLogItem(priority: Int, data: String) {
        bleActivityViewModel.addLogItem(
            sessionId = CommonMMKVOwner.iotDeviceLogSessionId, 
            priority = priority, 
            data = data
        )
    }

    companion object {
        fun newBundleArguments(
            type: ProductType = ProductType.UnKnown,
            communicateWay: CommunicateWay = NetPlatformConnect,
            deviceInfo: DeviceInfo,
            bleDevice: DiscoveredBluetoothDevice? = null,
            statusBarColor: Int = R.color.white
        ): Bundle = Bundle().apply {
            putParcelable(AppContants.Extras.PRODUCT_TYPE, type)
            putParcelable(AppContants.Extras.COMMUNICATION_WAY, communicateWay)
            putParcelable(AppContants.Extras.DEVICE_INFO, deviceInfo)
            putParcelable(AppContants.Extras.BLE_DEVICE, bleDevice)
            putInt(AppContants.Extras.STATUS_BAR_COLOR, statusBarColor)
        }
    }
}
```

## 7. 优化 BaseVmDbFragment

```kotlin
package com.shmedo.mcloudapp.ui.page.base.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.databinding.ViewDataBinding
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.kunminx.architecture.ui.page.DataBindingConfig
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

/**
 * 使用 ViewModel 和 DataBinding 的 Fragment 基类
 * 优化版本：支持更好的 Flow 收集和生命周期管理
 */
abstract class BaseVmDbFragment : BaseFragment() {
    
    private var binding: ViewDataBinding? = null
    
    /**
     * 获取 DataBinding 配置
     */
    abstract fun getDataBindingConfig(): DataBindingConfig
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val dataBindingConfig = getDataBindingConfig()
        binding = DataBindingUtil.inflate(
            inflater, 
            dataBindingConfig.layout, 
            container, 
            false
        )
        binding?.apply {
            // 绑定变量
            lifecycleOwner = viewLifecycleOwner
            
            val bindingParams = dataBindingConfig.bindingParams
            bindingParams.forEach { (key, value) ->
                setVariable(key, value)
            }
        }
        return binding?.root
    }
    
    /**
     * 获取已创建的 ViewDataBinding
     */
    protected fun getBinding(): ViewDataBinding? = binding
    
    /**
     * 便捷方法，用于在 STARTED 状态收集 Flow
     */
    protected fun <T> Flow<T>.collectWhenStarted(action: suspend (T) -> Unit) {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                collect(action)
            }
        }
    }
    
    /**
     * 便捷方法，用于在 STARTED 状态收集最新的 StateFlow 值
     */
    protected fun <T> StateFlow<T>.collectLatestWhenStarted(action: suspend (T) -> Unit) {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                collectLatest(action)
            }
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        // 释放绑定
        binding?.unbind()
        binding = null
    }
}
```

## 8. BaseFragment 的优化

```kotlin
package com.shmedo.mcloudapp.ui.page.base.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/**
 * Fragment 基类
 * 优化版本：支持更好的生命周期管理和 Flow 收集
 */
abstract class BaseFragment : Fragment() {
    
    /**
     * 初始化 ViewModel
     */
    open fun initViewModel() {}
    
    /**
     * 初始化视图
     */
    open fun initView(savedInstanceState: Bundle?) {}
    
    /**
     * 初始化数据
     */
    open fun initData() {}
    
    /**
     * 创建观察者
     */
    open fun createObserver() {}
    
    /**
     * 懒加载数据
     */
    open fun lazyLoadData() {}
    
    /**
     * 是否限制隐藏模式
     */
    open fun isRestrictHiddenMode(): Boolean = false
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initViewModel()
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initView(savedInstanceState)
        initData()
        createObserver()
        // 只有在可见时才加载数据
        if (isResumed) {
            lazyLoadData()
        }
    }
    
    override fun onResume() {
        super.onResume()
        // 确保数据只加载一次
        if (!isDataLoaded) {
            lazyLoadData()
            isDataLoaded = true
        }
    }
    
    // 追踪数据是否已加载
    private var isDataLoaded = false
    
    /**
     * 使用协程在视图生命周期内安全执行代码
     */
    protected fun launchWithViewLifecycle(block: suspend CoroutineScope.() -> Unit) {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                block()
            }
        }
    }
    
    /**
     * 便捷方法，安全地收集 Flow 的值
     */
    protected fun <T> Flow<T>.safeCollect(collect: suspend (T) -> Unit) {
        launchWithViewLifecycle {
            collect(collect)
        }
    }
    
    /**
     * 便捷方法，安全地收集 StateFlow 的最新值
     */
    protected fun <T> StateFlow<T>.safeCollectLatest(collect: suspend (T) -> Unit) {
        launchWithViewLifecycle {
            this@safeCollectLatest.collect(collect)
        }
    }
}
```

## 总结

以上优化方案的核心思想是将数据和状态管理从 Fragment 迁移到 ViewModel，并确保正确处理生命周期和状态管理。主要优化点包括：

1. **状态保存**: 使用 ViewModel 保存 UI 状态和数据，避免因 Fragment 视图重建而导致的数据丢失。

2. **共享 ViewModel**: 对于跨 Fragment 共享的状态（如蓝牙连接状态），使用 `activityViewModels()` 来获取作用域为 Activity 的 ViewModel，确保在 Fragment 导航过程中保持状态。

3. **状态流管理**: 使用 `StateFlow` 和 `SharedFlow` 替代传统的回调，提供更加声明式的状态管理方式。

4. **生命周期感知的数据收集**: 使用 `repeatOnLifecycle(Lifecycle.State.STARTED)` 确保数据流的收集与 Fragment 的生命周期同步，避免在 Fragment 处于后台时不必要的更新。

5. **幂等性操作**: 在 ViewModel 中实现幂等性操作，例如确保初始化代码只执行一次，即使 Fragment 经历多次视图重建。

6. **命令队列管理**: 实现命令队列系统，确保命令按顺序执行，并避免重复发送相同的命令。

7. **响应式通信**: 使用 Flow 进行 Fragment 间通信，替代传统的消息传递方式，提高代码的可维护性。

通过这些优化，可以显著改善用户体验，减少因 Fragment 视图重建导致的连接重复建立和数据重复加载问题。同时，代码也变得更加清晰和模块化，便于后续维护和扩展。
