var TaskStatus = {
    UNACCEPTABLE: 0,
    ACCEOTABLE: 1,
    DURING: 2,
    CAN_SUBMIT: 3,
    SUBMITTED: 4
};
var TaskCondition = (function () {
    function TaskCondition() {
    }
    var d = __define,c=TaskCondition,p=c.prototype;
    p.onAccept = function (task) {
        task.status = TaskStatus.DURING;
    };
    p.onSubmit = function (task) {
        task.status = TaskStatus.SUBMITTED;
    };
    return TaskCondition;
}());
egret.registerClass(TaskCondition,'TaskCondition');
var NPCTalkTaskCondition = (function () {
    function NPCTalkTaskCondition() {
    }
    var d = __define,c=NPCTalkTaskCondition,p=c.prototype;
    p.onAccept = function (task) {
        task.status = TaskStatus.DURING;
    };
    p.onSubmit = function (task) {
        task.status = TaskStatus.SUBMITTED;
    };
    return NPCTalkTaskCondition;
}());
egret.registerClass(NPCTalkTaskCondition,'NPCTalkTaskCondition');
var KillMonsterTaskCondition = (function () {
    function KillMonsterTaskCondition(id, context, scenceService) {
        this.monsterId = id;
        this.context = context;
        this.status = TaskStatus.CAN_SUBMIT;
        this.scenceService = scenceService;
        this.scenceService.addObserver(this);
    }
    var d = __define,c=KillMonsterTaskCondition,p=c.prototype;
    p.onAccept = function (task) {
        this.status = TaskStatus.DURING;
    };
    p.onSubmit = function (task) {
        this.status = TaskStatus.SUBMITTED;
    };
    p.onChange = function (id) {
        if (id == this.monsterId && this.status == TaskStatus.DURING) {
            console.log(this.status);
            this.context.setcurrent(this.context.getcurrent() + 1);
        }
    };
    return KillMonsterTaskCondition;
}());
egret.registerClass(KillMonsterTaskCondition,'KillMonsterTaskCondition',["Observer"]);
var Task = (function () {
    function Task(taskService, scenceService, id, name, desc, status, fromNpcId, toNpcId, current, total) {
        this.current = 0;
        this.total = -1;
        this.taskService = taskService;
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
        this.taskCondition = new KillMonsterTaskCondition("001", this, scenceService);
        this.current = current;
        this.total = total;
    }
    var d = __define,c=Task,p=c.prototype;
    p.onAccept = function () {
        this.taskCondition.onAccept(this);
    };
    p.onsubmit = function () {
        this.taskCondition.onSubmit(this);
    };
    p.getcurrent = function () {
        return this.current;
    };
    p.setcurrent = function (current) {
        this.current = current;
        this.checkStatus();
    };
    p.checkStatus = function () {
        if (this.current >= this.total) {
            this.current = this.total;
            this.status = TaskStatus.CAN_SUBMIT;
            console.log("Finish");
        }
        this.taskService.notify(this);
        console.log(this.status);
    };
    return Task;
}());
egret.registerClass(Task,'Task',["TaskConditionContext"]);
//# sourceMappingURL=Task.js.map