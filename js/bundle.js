"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/BenchmarkRT.generated.ts
  var BenchmarkRTBase = class extends Laya.Scene {
  };

  // src/BenchmarkRT.ts
  var { regClass } = Laya;
  var BenchmarkRT = class extends BenchmarkRTBase {
    constructor() {
      super(...arguments);
      this.heroList = [
        "hero_2158",
        "hero_3162",
        "hero_3164",
        "hero_3165",
        "hero_3169",
        "hero_3170",
        "hero_3171",
        "hero_3250",
        "hero_3251",
        "hero_3252",
        "hero_3253",
        "hero_4102",
        "hero_4103",
        "hero_4104",
        "hero_4105",
        "hero_4107",
        "hero_4110",
        "hero_4115",
        "hero_4118",
        "hero_4119",
        "hero_4120",
        "hero_4125",
        "hero_4137",
        "hero_4159",
        "hero_4160",
        "hero_4162",
        "hero_4163",
        "hero_4164",
        "hero_4165",
        "hero_4166",
        "hero_4167",
        "hero_4168",
        "hero_4169",
        "hero_4172",
        "hero_4173",
        "hero_4174",
        "hero_4175",
        "hero_4176",
        "hero_5101",
        "hero_5102"
      ];
      this.spineNodes = [];
      // 드래그 관련 변수
      this.selectedSpine = null;
      this.dragOffsetX = 0;
      this.dragOffsetY = 0;
      this.isDragging = false;
    }
    onAwake() {
      this.createTextsLabel();
      Laya.timer.frameLoop(1, this, this.onUpdate);
      this.createBtn.on(Laya.Event.CLICK, this, this.onCreateSpine);
      this.deleteBtn.on(Laya.Event.CLICK, this, this.onDeleteSpine);
      this.spineContainer = new Laya.Sprite();
      this.addChild(this.spineContainer);
      Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
      Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }
    onDisable() {
      if (this.createBtn) {
        this.createBtn.off(Laya.Event.CLICK, this, this.onCreateSpine);
      }
      if (this.deleteBtn) {
        this.deleteBtn.off(Laya.Event.CLICK, this, this.onDeleteSpine);
      }
      Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
      Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }
    onDestroy() {
      Laya.timer.clear(this, this.onUpdate);
    }
    onUpdate() {
      this.fpsLabel.text = `FPS: ${Laya.Stat.FPS}`;
    }
    createTextsLabel() {
      this.fpsLabel = new Laya.Text();
      this.fpsLabel.fontSize = 24;
      this.fpsLabel.color = "#00ff00";
      this.fpsLabel.padding = [5, 10, 5, 10];
      this.fpsLabel.pos(10, 10);
      this.fpsLabel.text = "FPS: 0";
      this.addChild(this.fpsLabel);
      this.countLabel = new Laya.Text();
      this.countLabel.fontSize = 24;
      this.countLabel.color = "#ffff00ff";
      this.countLabel.padding = [5, 10, 5, 10];
      this.countLabel.pos(10, 50);
      this.countLabel.text = "Count: 0";
      this.updateCountLabel();
      this.addChild(this.countLabel);
    }
    // 스파인 마우스 다운 (드래그 시작)
    onSpineMouseDown(spineNode, e) {
      e.stopPropagation();
      this.selectedSpine = spineNode;
      this.isDragging = true;
      this.dragOffsetX = Laya.stage.mouseX - spineNode.x;
      this.dragOffsetY = Laya.stage.mouseY - spineNode.y;
      spineNode.zOrder = 99999;
      this.spineContainer.addChild(spineNode);
      console.log("드래그 시작");
    }
    // 마우스 이동 (드래그 중)
    onMouseMove() {
      if (!this.isDragging || !this.selectedSpine)
        return;
      const newX = Laya.stage.mouseX - this.dragOffsetX;
      const newY = Laya.stage.mouseY - this.dragOffsetY;
      this.selectedSpine.pos(newX, newY);
    }
    // 마우스 업 (드래그 종료)
    onMouseUp() {
      if (this.isDragging && this.selectedSpine) {
        this.updateSpineZOrder(this.selectedSpine);
        console.log("드래그 종료");
      }
      this.isDragging = false;
      this.selectedSpine = null;
    }
    onCreateSpine() {
      const randomIndex = Math.floor(Math.random() * this.heroList.length);
      const heroName = this.heroList[randomIndex];
      const spinePath = `resources/spines/${heroName}/${heroName}.skel`;
      const templet = Laya.loader.getRes(spinePath);
      if (!templet) {
        console.log(`스파인 템플릿을 찾을 수 없습니다. : ${spinePath}`);
        return;
      }
      const spineNode = new Laya.Sprite();
      const spineRender = spineNode.addComponent(Laya.Spine2DRenderNode);
      spineRender.useFastRender = false;
      spineRender.templet = templet;
      const randomX = 100 + Math.random() * (Laya.stage.width - 500);
      const randomY = 50 + Math.random() * (Laya.stage.height - 300);
      spineNode.pos(randomX, randomY);
      spineNode.scale(0.1, 0.1);
      spineNode.mouseEnabled = true;
      spineNode.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        const localX = e.stageX - spineNode.x;
        const localY = e.stageY - spineNode.y;
        const realX = localX / spineNode.scaleX;
        const realY = localY / spineNode.scaleY;
        console.log(`클릭 로컬 좌표: (${realX}, ${realY})`);
      });
      spineNode.on(Laya.Event.MOUSE_DOWN, this, this.onSpineMouseDown, [spineNode]);
      try {
        spineRender.play("idle", true);
      } catch (e) {
        const animCount = spineRender.getAnimNum();
        if (animCount > 0) {
          const firstAnim = spineRender.getAniNameByIndex(0);
          spineRender.play(firstAnim, true);
        }
      }
      this.spineContainer.addChild(spineNode);
      this.spineNodes.push(spineNode);
      this.updateSpineZOrder(spineNode);
      const shadowSlot = spineRender.getSlotByName("shadow");
      const bone = shadowSlot.bone;
      spineNode.hitArea = new Laya.Rectangle(bone.worldX - randomX, -bone.worldY - randomY - 2e3, 1e3, 2e3);
      console.log(`${heroName} 생성! 총 ${this.spineNodes.length}개`);
      this.updateCountLabel();
    }
    onDeleteSpine() {
      if (this.spineNodes.length === 0) {
        console.log("삭제할 캐릭터가 없습니다!");
        return;
      }
      const randomIndex = Math.floor(Math.random() * this.spineNodes.length);
      const targetNode = this.spineNodes[randomIndex];
      targetNode.off(Laya.Event.MOUSE_DOWN, this, this.onSpineMouseDown);
      this.spineNodes.splice(randomIndex, 1);
      targetNode.destroy();
      console.log(`캐릭터 삭제! 남은 수: ${this.spineNodes.length}`);
      this.updateCountLabel();
    }
    updateCountLabel() {
      this.countLabel.text = `Count: ${this.spineNodes.length}`;
    }
    updateSpineZOrder(spine) {
      spine.zOrder = spine.y;
    }
  };
  BenchmarkRT = __decorateClass([
    regClass("oZUkORTdQ92lnoTdHeTSCg")
  ], BenchmarkRT);

  // src/IndexRT.generated.ts
  var IndexRTBase = class extends Laya.Scene {
  };

  // src/IndexRT.ts
  var { regClass: regClass2 } = Laya;
  var IndexRT = class extends IndexRTBase {
    onEnable() {
      this.btn0.on(Laya.Event.MOUSE_DOWN, this, this.btnChangeScene, ["benchmark"]);
      this.btn1.on(Laya.Event.MOUSE_DOWN, this, this.btnChangeScene, ["particle"]);
    }
    btnChangeScene(sceneName) {
      Laya.Scene.open(`scenes/${sceneName}.ls`);
    }
  };
  IndexRT = __decorateClass([
    regClass2("pEmErmcKRO2yIqHx68EWcA")
  ], IndexRT);

  // src/MainRT.generated.ts
  var MainRTBase = class extends Laya.Scene {
  };

  // src/MainRT.ts
  var { regClass: regClass3, property } = Laya;
  var Main = class extends MainRTBase {
    onAwake() {
      return __async(this, null, function* () {
        try {
          yield Laya.loader.load(
            [
              { url: "./scenes/index.ls", type: Laya.Loader.HIERARCHY },
              { url: "./scenes/particle.ls", type: Laya.Loader.HIERARCHY },
              { url: "./resources/spines/hero_2158/hero_2158.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3162/hero_3162.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3164/hero_3164.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3165/hero_3165.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3169/hero_3169.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3170/hero_3170.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3171/hero_3171.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3250/hero_3250.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3251/hero_3251.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3252/hero_3252.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_3253/hero_3253.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4102/hero_4102.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4103/hero_4103.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4104/hero_4104.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4105/hero_4105.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4107/hero_4107.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4110/hero_4110.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4115/hero_4115.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4118/hero_4118.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4119/hero_4119.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4120/hero_4120.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4125/hero_4125.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4137/hero_4137.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4159/hero_4159.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4160/hero_4160.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4162/hero_4162.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4163/hero_4163.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4164/hero_4164.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4165/hero_4165.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4166/hero_4166.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4167/hero_4167.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4168/hero_4168.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4169/hero_4169.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4172/hero_4172.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4173/hero_4173.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4174/hero_4174.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4175/hero_4175.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_4176/hero_4176.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_5101/hero_5101.skel", type: Laya.Loader.SPINE },
              { url: "./resources/spines/hero_5102/hero_5102.skel", type: Laya.Loader.SPINE },
              { url: "./prefab/particle_dot_light.lh", type: Laya.Loader.HIERARCHY },
              { url: "./prefab/particle_heal.lh", type: Laya.Loader.HIERARCHY },
              { url: "./prefab/skill1.lh", type: Laya.Loader.HIERARCHY }
            ],
            null,
            Laya.Handler.create(this, this.onLoading, null, false)
          );
          this.progress.value = 0.98;
          console.log("로딩 완료", this.progress.value);
          yield new Promise((resolve) => Laya.timer.once(1e3, this, resolve));
          Laya.Scene.open("scenes/index.ls");
          Laya.loader.on(Laya.Event.ERROR, this, this.onError);
        } catch (err) {
          console.log("Resource Error : " + err);
        }
      });
    }
    onError(err) {
      console.log("Error : " + err);
    }
    onLoading(progress) {
      if (progress > 0.92)
        this.progress.value = 0.95;
      else
        this.progress.value = progress;
      console.log("진행상황: " + progress, this.progress.value);
    }
  };
  Main = __decorateClass([
    regClass3("r4r_ehvoR5WIp_xMA1jeTQ")
  ], Main);

  // src/ParticleRT.generated.ts
  var ParticleRTBase = class extends Laya.Scene {
  };

  // src/ParticleRT.ts
  var { regClass: regClass4 } = Laya;
  var ParticleRT = class extends ParticleRTBase {
    onEnable() {
      this.btn0_0.on(Laya.Event.MOUSE_DOWN, this, this.btnPlayAnimation, ["idle"]);
      this.btn0_1.on(Laya.Event.MOUSE_DOWN, this, this.btnPlayAnimation, ["run"]);
      this.btn0_2.on(Laya.Event.MOUSE_DOWN, this, this.btnPlayAnimation, ["attack_1"]);
      this.btn1_0.on(Laya.Event.MOUSE_DOWN, this, this.btnPlayParticle, ["particle_heal"]);
      this.btn1_1.on(Laya.Event.MOUSE_DOWN, this, this.btnPlayParticle, ["particle_dot_light"]);
      this.btn1_2.on(Laya.Event.MOUSE_DOWN, this, this.btnPlayParticle, ["skill1"]);
    }
    onDisable() {
      this.btn0_0.off(Laya.Event.MOUSE_DOWN, this, this.btnPlayAnimation, ["idle"]);
      this.btn0_1.off(Laya.Event.MOUSE_DOWN, this, this.btnPlayAnimation, ["run"]);
      this.btn0_2.off(Laya.Event.MOUSE_DOWN, this, this.btnPlayAnimation, ["attack_1"]);
      this.btn1_0.off(Laya.Event.MOUSE_DOWN, this, this.btnPlayParticle, ["particle_heal"]);
      this.btn1_1.off(Laya.Event.MOUSE_DOWN, this, this.btnPlayParticle, ["particle_dot_light"]);
      this.btn1_2.off(Laya.Event.MOUSE_DOWN, this, this.btnPlayParticle, ["skill1"]);
    }
    btnPlayAnimation(name) {
      const spineRender = this.spine.getComponent(Laya.Spine2DRenderNode);
      spineRender.play(`${name}`, true);
      if (name == "attack_1")
        spineRender.addAnimation("idle", true, 0);
    }
    btnPlayParticle(name) {
      const prefab = Laya.loader.getRes(`prefab/${name}.lh`);
      if (!prefab) {
        console.log("프리팹이 로드되지 않았습니다!");
        return;
      }
      const particleNode = prefab.create();
      this.addChild(particleNode);
      console.log("자식수 : " + this.numChildren);
      particleNode.pos(400, 300);
      console.log("파티클 생성 완료!");
      const renderer = particleNode.getComponent(Laya.ShurikenParticle2DRenderer);
      if (renderer) {
        const particleSystem = renderer.particleSystem;
        particleSystem.main.looping = false;
        const duration = particleSystem.main.duration * 1e3 + 500;
        Laya.timer.once(duration, this, () => {
          particleNode.destroy();
          console.log("파티클 제거 완료!");
        });
      }
    }
  };
  ParticleRT = __decorateClass([
    regClass4("3FxNDeWuREySqY0DfeeqFQ")
  ], ParticleRT);
})();
