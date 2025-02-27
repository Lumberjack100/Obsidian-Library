---
NotionID-ob2notion: 1a7038ef-a6c2-818e-bad8-e89388cadc11
link-ob2notion: https://www.notion.so/Chart-1a7038efa6c2818ebad8e89388cadc11
---

##  用户指令

``` chartData 数据格式示例

{
            categories: ["02-10 12:36","02-10 13:36","02-10 15:36"...],
            series: [    
              {
                name: "黄色告警",// 告警名称: 红色告警、橙色告警、黄色告警、蓝色告警；对应 queryDataWarnHistory 接口返回数据中的 aliasConfig.warnLevel
                index: 1,
                type: "column",
                color: "#F8CB00",// 告警颜色: #E34D59(红色)、#FDA251(橙色)、#F8CB00(黄色)、#0077EE(蓝色)
                data: [300.000] // 告警阈值；对应 queryDataWarnHistory 接口返回数据中的 threshold
              },           
              {
                name: "风象监测点1",// 监测点名称，对应 queryDataWarnDetail 接口返回数据中的 monitorPointName
                type: "line",
                color: "#3CA272",
                data: [248.000,135.000,240.000,58.000...]// 监测点数据，根据 queryDataWarnDetail 接口返回数据中的 fieldToken 从 queryMonitorPointHistoryDataList 接口返回数据中的 dataList 中获取对应属性的值
              }
            ]
          }


```

```
//接口 "queryDataWarnDetail" 返回数据格式如下：

 {
        "warnTag": 2,
        "warnLevelType": 1,
        "warnLevelStyle": 1,
        "id": 1,
        "warnName": "风向异常",
        "workOrderID": null,
        "dealContent": null,
        "dealUserID": null,
        "dealUserName": null,
        "dealTime": null,
        "aliasConfig": {
            "warnLevel": 3,
            "alias": null
        },
        "dealStatus": 0,
        "warnTime": "2025-02-13 11:36:16",
        "warnEndTime": "2025-02-13 12:36:16",
        "projectID": 278,
        "projectName": "测试水库项目流程01",
        "projectShotName": "测试水库项目流程01",
        "monitorItemID": 299,
        "monitorItemName": "风力风速",
        "monitorItemAlias": "风力风速",
        "monitorPointID": 794,
        "monitorPointName": "风象监测点1",
        "gpsLocation": "121.209725,31.191092",
        "fieldID": 183,
        "fieldName": "风向",
        "fieldToken": "windDirection",
        "sensorID": 1237,
        "sensorName": "8_3",
        "sensorAlias": "265_1"
    }

```


```
//接口 "queryDataWarnHistory" 返回数据格式如下：
{
        "warnTag": 2,
        "warnLevelType": 1,
        "warnLevelStyle": 1,
        "dataList": [
            {
                "warnTime": "2025-01-22 15:59:44",
                "compareMode": 3,
                "threshold": "{\"upper\":300}",
                "aliasConfig": {
                    "warnLevel": 2,
                    "alias": null
                }
            },
            {
                "warnTime": "2025-01-22 16:01:14",
                "compareMode": 3,
                "threshold": "{\"upper\":400}",
                "aliasConfig": {
                    "warnLevel": 1,
                    "alias": null
                }
            }
        ]
    }

```

```
//接口 "queryMonitorPointHistoryDataList" 返回数据格式如下：

{
        "monitorPoint": {
            "projectID": 278,
            "monitorType": 8,
            "monitorItemID": 299,
            "name": "风象监测点1",
            "installLocation": null,
            "gpsLocation": "121.209725,31.191092",
            "imageLocation": "",
            "overallViewLocation": null,
            "spatialLocation": null,
            "enable": true,
            "exValues": null,
            "displayOrder": null,
            "createTime": "2023-11-16 16:53:45",
            "createUserID": 692,
            "updateTime": "2024-12-30 13:26:48",
            "updateUserID": 536,
            "id": 794
        },
        "sensorList": [
            {
                "projectID": 278,
                "templateID": 133,
                "dataSourceID": "caed2f22-337f-4bb8-bbb7-e8a66e21ea56",
                "dataSourceComposeType": 1,
                "monitorType": 8,
                "name": "8_3",
                "alias": "265_1",
                "kind": 1,
                "displayOrder": 0,
                "monitorPointID": 794,
                "configFieldValue": null,
                "exValues": null,
                "status": 0,
                "warnNoData": null,
                "monitorBeginTime": null,
                "imagePath": null,
                "enable": true,
                "createTime": "2023-11-20 16:53:06",
                "createUserID": 692,
                "updateTime": "2025-02-13 15:36:24",
                "updateUserID": 692,
                "videoDeviceID": null,
                "channelCode": null,
                "videoDeviceSourceID": null,
                "id": 1237,
                "onlineStatus": 0
            }
        ],
        "dataList": [
            {
                "windPower": 6,
                "time": "2025-02-13 15:36:16.000",
                "windDirection": 26.0,
                "windSpeed": 13.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-13 14:36:16.000",
                "windDirection": 75.0,
                "windSpeed": 11.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-13 13:36:16.000",
                "windDirection": 80.0,
                "windSpeed": 18.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 1,
                "time": "2025-02-13 12:36:16.000",
                "windDirection": 182.0,
                "windSpeed": 1.0,
                "windScale": 1.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-13 11:36:16.000",
                "windDirection": 345.0,
                "windSpeed": 17.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-13 10:36:16.000",
                "windDirection": 229.0,
                "windSpeed": 19.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-13 09:36:16.000",
                "windDirection": 78.0,
                "windSpeed": 2.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-13 08:36:16.000",
                "windDirection": 332.0,
                "windSpeed": 13.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-13 07:36:16.000",
                "windDirection": 350.0,
                "windSpeed": 2.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-13 06:36:16.000",
                "windDirection": 303.0,
                "windSpeed": 19.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-13 05:36:16.000",
                "windDirection": 216.0,
                "windSpeed": 17.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-13 04:36:16.000",
                "windDirection": 18.0,
                "windSpeed": 13.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-13 03:36:16.000",
                "windDirection": 312.0,
                "windSpeed": 13.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-13 02:36:16.000",
                "windDirection": 276.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-13 01:36:16.000",
                "windDirection": 56.0,
                "windSpeed": 3.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-13 00:36:16.000",
                "windDirection": 259.0,
                "windSpeed": 5.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-12 23:36:16.000",
                "windDirection": 217.0,
                "windSpeed": 2.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-12 22:36:16.000",
                "windDirection": 350.0,
                "windSpeed": 11.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-12 21:36:16.000",
                "windDirection": 60.0,
                "windSpeed": 2.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 5,
                "time": "2025-02-12 19:36:16.000",
                "windDirection": 358.0,
                "windSpeed": 8.0,
                "windScale": 5.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-12 18:36:16.000",
                "windDirection": 161.0,
                "windSpeed": 11.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 5,
                "time": "2025-02-12 17:36:16.000",
                "windDirection": 341.0,
                "windSpeed": 8.0,
                "windScale": 5.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-12 16:36:16.000",
                "windDirection": 6.0,
                "windSpeed": 5.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-12 15:36:16.000",
                "windDirection": 96.0,
                "windSpeed": 12.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-12 14:36:16.000",
                "windDirection": 73.0,
                "windSpeed": 5.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-12 13:36:13.000",
                "windDirection": 167.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-12 12:36:13.000",
                "windDirection": 130.0,
                "windSpeed": 18.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-12 11:36:13.000",
                "windDirection": 25.0,
                "windSpeed": 12.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 5,
                "time": "2025-02-12 10:36:13.000",
                "windDirection": 229.0,
                "windSpeed": 10.0,
                "windScale": 5.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-12 09:36:13.000",
                "windDirection": 33.0,
                "windSpeed": 15.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-12 08:36:13.000",
                "windDirection": 254.0,
                "windSpeed": 17.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 5,
                "time": "2025-02-12 07:36:13.000",
                "windDirection": 356.0,
                "windSpeed": 10.0,
                "windScale": 5.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-12 06:36:13.000",
                "windDirection": 54.0,
                "windSpeed": 4.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-12 05:36:13.000",
                "windDirection": 38.0,
                "windSpeed": 5.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-12 04:36:13.000",
                "windDirection": 154.0,
                "windSpeed": 5.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-12 03:36:13.000",
                "windDirection": 38.0,
                "windSpeed": 19.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-12 02:36:14.000",
                "windDirection": 116.0,
                "windSpeed": 5.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 5,
                "time": "2025-02-12 01:36:13.000",
                "windDirection": 78.0,
                "windSpeed": 8.0,
                "windScale": 5.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-12 00:36:13.000",
                "windDirection": 16.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-11 23:36:13.000",
                "windDirection": 25.0,
                "windSpeed": 14.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-11 22:36:14.000",
                "windDirection": 304.0,
                "windSpeed": 4.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 1,
                "time": "2025-02-11 21:36:13.000",
                "windDirection": 227.0,
                "windSpeed": 1.0,
                "windScale": 1.0,
                "sensorID": 1237
            },
            {
                "windPower": 5,
                "time": "2025-02-11 20:36:14.000",
                "windDirection": 151.0,
                "windSpeed": 10.0,
                "windScale": 5.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-11 19:36:13.000",
                "windDirection": 141.0,
                "windSpeed": 4.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-11 18:36:13.000",
                "windDirection": 4.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-11 17:36:13.000",
                "windDirection": 133.0,
                "windSpeed": 14.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-11 16:36:13.000",
                "windDirection": 108.0,
                "windSpeed": 20.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 5,
                "time": "2025-02-11 15:36:13.000",
                "windDirection": 197.0,
                "windSpeed": 8.0,
                "windScale": 5.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-11 14:36:13.000",
                "windDirection": 102.0,
                "windSpeed": 20.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-11 13:36:14.000",
                "windDirection": 197.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-11 12:36:13.000",
                "windDirection": 358.0,
                "windSpeed": 12.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-11 11:36:13.000",
                "windDirection": 66.0,
                "windSpeed": 5.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-11 10:36:13.000",
                "windDirection": 55.0,
                "windSpeed": 5.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-11 09:36:13.000",
                "windDirection": 104.0,
                "windSpeed": 18.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 5,
                "time": "2025-02-11 08:36:13.000",
                "windDirection": 78.0,
                "windSpeed": 9.0,
                "windScale": 5.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-11 07:36:13.000",
                "windDirection": 208.0,
                "windSpeed": 16.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-11 06:36:13.000",
                "windDirection": 246.0,
                "windSpeed": 3.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-11 05:36:13.000",
                "windDirection": 332.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-11 04:36:12.000",
                "windDirection": 233.0,
                "windSpeed": 16.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-11 03:36:12.000",
                "windDirection": 360.0,
                "windSpeed": 7.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 3,
                "time": "2025-02-11 02:36:12.000",
                "windDirection": 1.0,
                "windSpeed": 4.0,
                "windScale": 3.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-11 01:36:12.000",
                "windDirection": 276.0,
                "windSpeed": 12.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-11 00:36:12.000",
                "windDirection": 128.0,
                "windSpeed": 15.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 6,
                "time": "2025-02-10 23:36:12.000",
                "windDirection": 299.0,
                "windSpeed": 13.0,
                "windScale": 6.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-10 22:36:12.000",
                "windDirection": 340.0,
                "windSpeed": 3.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-10 21:36:12.000",
                "windDirection": 31.0,
                "windSpeed": 2.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 8,
                "time": "2025-02-10 20:36:12.000",
                "windDirection": 148.0,
                "windSpeed": 19.0,
                "windScale": 8.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-10 19:36:12.000",
                "windDirection": 329.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-10 18:36:12.000",
                "windDirection": 5.0,
                "windSpeed": 16.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-10 17:36:12.000",
                "windDirection": 241.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-10 16:36:12.000",
                "windDirection": 252.0,
                "windSpeed": 3.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-10 15:36:12.000",
                "windDirection": 58.0,
                "windSpeed": 16.0,
                "windScale": 7.0,
                "sensorID": 1237
            },
            {
                "windPower": 2,
                "time": "2025-02-10 14:36:12.000",
                "windDirection": 240.0,
                "windSpeed": 3.0,
                "windScale": 2.0,
                "sensorID": 1237
            },
            {
                "windPower": 4,
                "time": "2025-02-10 13:36:12.000",
                "windDirection": 135.0,
                "windSpeed": 6.0,
                "windScale": 4.0,
                "sensorID": 1237
            },
            {
                "windPower": 7,
                "time": "2025-02-10 12:36:12.000",
                "windDirection": 248.0,
                "windSpeed": 17.0,
                "windScale": 7.0,
                "sensorID": 1237
            }
        ],
        "fieldList": [
            {
                "fieldToken": "windSpeed",
                "fieldName": "风速",
                "fieldOrder": 1,
                "fieldTypeOrder": null,
                "fieldType": "DOUBLE",
                "fieldStatisticsType": "1",
                "fieldJsonPath": null,
                "fieldExValue": "14",
                "childFieldList": null
            },
            {
                "fieldToken": "windDirection",
                "fieldName": "风向",
                "fieldOrder": 2,
                "fieldTypeOrder": null,
                "fieldType": "DOUBLE",
                "fieldStatisticsType": "1",
                "fieldJsonPath": null,
                "fieldExValue": "4",
                "childFieldList": null
            },
            {
                "fieldToken": "windScale",
                "fieldName": "风级",
                "fieldOrder": 3,
                "fieldTypeOrder": null,
                "fieldType": "LONG",
                "fieldStatisticsType": "2",
                "fieldJsonPath": null,
                "fieldExValue": "18",
                "childFieldList": null
            },
            {
                "fieldToken": "windPower",
                "fieldName": "风力风向",
                "fieldOrder": 4,
                "fieldTypeOrder": null,
                "fieldType": "LONG",
                "fieldStatisticsType": "2",
                "fieldJsonPath": null,
                "fieldExValue": "18",
                "childFieldList": null
            },
            {
                "fieldToken": "windPower",
                "fieldName": "风力",
                "fieldOrder": 0,
                "fieldTypeOrder": null,
                "fieldType": null,
                "fieldStatisticsType": "1",
                "fieldJsonPath": null,
                "fieldExValue": "38",
                "childFieldList": null
            }
        ],
        "dataUnitList": [
            {
                "engUnit": "°",
                "chnUnit": "度",
                "unitClass": "角度",
                "unitDesc": "度",
                "id": 4
            },
            {
                "engUnit": "m/s",
                "chnUnit": "米每秒",
                "unitClass": "速度",
                "unitDesc": "米每秒",
                "id": 14
            },
            {
                "engUnit": "",
                "chnUnit": "无",
                "unitClass": "无",
                "unitDesc": "无",
                "id": 18
            },
            {
                "engUnit": "级",
                "chnUnit": "级",
                "unitClass": "等级",
                "unitDesc": "级",
                "id": 38
            }
        ]
    }

```


请你完善优化 @dataWarningDetail.vue 的图表功能, 要求如下：
1. 重构 manageHourChartsData 方法，使最终返回的数据格式符合 chartData 数据示例格式要求
