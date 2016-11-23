var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        this.touchEnabled = true;
        var scenceService = new SceneService();
        var taskService = new TaskService(scenceService);
        var taskPanel = new TaskPanel(this, taskService);
        var dialoguePanel = new DialoguePanel(this, taskService);
        var npc_0 = new NPC("npc_0", "NPC_1", taskService, dialoguePanel);
        npc_0.setNpc(0, 100, 0x800080);
        npc_0.drawNpc();
        this.addChild(npc_0.npcStage);
        npc_0.getTask();
        var npc_1 = new NPC("npc_1", "NPC_2", taskService, dialoguePanel);
        npc_1.setNpc(200, 100, 0x0000FF);
        npc_1.drawNpc();
        this.addChild(npc_1.npcStage);
        npc_1.getTask();
        var button = new egret.Shape();
        button.graphics.beginFill(0xFF0000, 1);
        button.graphics.drawRect(0, 0, 50, 50);
        button.graphics.endFill();
        this.addChild(button);
        button.touchEnabled = true;
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, ontouch, this);
        function ontouch(e) {
            scenceService.notify("001");
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map