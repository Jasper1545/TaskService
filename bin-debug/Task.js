var TaskStatus = {
    UNACCEPTABLE: 0,
    ACCEOTABLE: 1,
    DURING: 2,
    CAN_SUBMIT: 3,
    SUBMITTED: 4
};
var Task = (function () {
    function Task(id, name, desc, status, fromNpcId, toNpcId) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
    }
    var d = __define,c=Task,p=c.prototype;
    return Task;
}());
egret.registerClass(Task,'Task');
//# sourceMappingURL=Task.js.map