<template>
  <div class="modal" v-show="isVisible" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>选择定位</h2>
      </header>
      <div class="modal-body">
        <input style="width: 47%;margin-left:5%" v-model="keyWords" placeholder="输入要添加的定位" />
        <a-button class="search" @click="setPlace">搜索</a-button>
        <a-button class="locaton"  type="primary" @click="fixedPos">定位到当前位置</a-button>
        <slot>
          <div class="map-box">
          <div id="map"></div>
          </div>
        </slot>
      </div>
      <footer class="modal-footer">
        <slot name="footer">      
          <div>
            <span style="margin-left:5%">当前定位</span>
            <input style="width: 40%;" v-model="location" readonly="readonly"/>
            <a-button class="left-button" @click="closeModal">取消添加</a-button>
            <a-button class="right-button" type="primary" @click="addLocation"
              >确认添加</a-button>
          </div>  
        </slot>
      </footer>
    </div>
  </div>
</template>  
    
<script>
import loadBMap from "../request/map";
export default {
  name: "Modal",
  data() {
    return {
      map: null,
      mk: null,
      local: null,
      point: null,
      latitude: "",
      longitude: "",
      keyWords: "",
      location: "",
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isVisible() {
      return this.visible;
    },
  },
  //这里运用async/await 进行异步处理，保证BMap加载进来后才执行后面的操作
  async mounted() {
    await loadBMap(); //加载引入BMap
    this.initMap();
    this.fixedPos();
  },
  methods: {
    closeModal() {
      this.$emit("mapModal", false);
      this.localtion = ""
      this.keyWords = ""
    },
    addLocation(){
      this.$emit("mapLocation", this.location);
      this.closeModal()
    },
    initMap() {
      this.map = new BMap.Map("map");
      let point = new BMap.Point(116.404, 39.915);
      this.map.centerAndZoom(point, 18);
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      this.map.addControl(new BMap.NavigationControl());
    },
    // 定位到当前位置
    fixedPos() {
      this.keyWords = ""
      const _this = this;
      const geolocation = new BMap.Geolocation();
      this.confirmLoading = true;
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          _this.handleMarker(_this, r.point);
          let myGeo = new BMap.Geocoder();
          _this.point = r.point;
          myGeo.getLocation(
            new BMap.Point(r.point.lng, r.point.lat),
            function (result) {
              _this.confirmLoading = false;
              if (result) {
                _this.latitude = result.point.lat;
                _this.longitude = result.point.lng;
                _this.getAddrByPoint(_this.point);
              }
            }
          );
        } else {
          _this.$message.error("failed" + this.getStatus());
        }
      });
    },
    // 逆地址解析函数（根据坐标点获取详细地址）
    getAddrByPoint(point) {
      var that = this;
      var geco = new BMap.Geocoder();
      that.map.panTo(point);
      geco.getLocation(point, function (res) {
        console.log(res); 
        that.mk.setPosition(point); //重新设置标注的地理坐标
        that.map.panTo(point); //将地图的中心点更改为给定的点
        that.location = res.address; //记录该点的详细地址信息
        that.point = point; //记录当前坐标点
      });
    },
    // 搜索地址
    setPlace() {
      this.local = new BMap.LocalSearch(this.map, {
        onSearchComplete: this.searchPlace,
      });
      this.local.search(this.keyWords);
      this.location = this.keyWords
    },
    searchPlace() {
      if (this.local.getResults() != undefined) {
        this.map.clearOverlays(); //清除地图上所有覆盖物
        if (this.local.getResults().getPoi(0)) {
          let point = this.local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          this.map.centerAndZoom(point, 18);
          this.handleMarker(this, point);
          console.log("经度：" + point.lng + "--" + "纬度" + point.lat);
          this.latitude = point.lat;
          this.longitude = point.lng;
        } else {
          this.$message.error("未匹配到地点!");
        }
      } else {
        this.$message.error("未找到搜索结果!");
      }
    },
    // 设置标注
    handleMarker(obj, point) {
      obj.mk = new BMap.Marker(point);
      obj.map.addOverlay(obj.mk);
      obj.mk.enableDragging(); // 可拖拽
      obj.mk.addEventListener("dragend", function (e) {
        // 监听标注的拖拽，获取拖拽后的经纬度
        this.latitude = point.lat;
        this.longitude = point.lng;
      });
      obj.map.panTo(point);
    },
  },
};
</script>  
    
  <style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 45vw; /* 占据屏幕宽度的45% */
  position: relative; /* 为了确保关闭按钮的定位 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.search{
  margin-left: 5px;
  margin-right: 5px;
}

.left-button {
  margin-left: 5px;
}
.right-button {
  margin-left: 5px;
}
#map {
  margin-top: 10px;
  width: 100%;
  height: 400px;
  margin-bottom: 5px;
  border: 1px solid gray;
  box-sizing: border-box;
  overflow: hidden;
}
</style>