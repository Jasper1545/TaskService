var ErrorCode = {

	NO_ERRIR:0,
	ID_NOTFOUND:1
}

class TaskService {

	observerList:Observer[];
	taskList:Task[];

	task01:Task;

	public constructor() {
		this.observerList = new Array();
		this.taskList = new Array();
		this.task01 = new Task("000","Task000","Go to NPC_2",TaskStatus.ACCEOTABLE,"npc_0","npc_1");
		this.taskList.push(this.task01);
	}

	addObserver(observer:Observer) {
		this.observerList.push(observer);
	}

	accept(id:string):number {
		for(var i = 0; i < this.taskList.length; i++) {
			if(this.taskList[i].id == id) {
				console.log("Find Task: " + this.taskList[i].id);
				this.taskList[i].status = TaskStatus.CAN_SUBMIT;
				this.notify(this.taskList[i]);
				return ErrorCode.NO_ERRIR;

			}else if(i == this.taskList.length - 1) {
				return ErrorCode.ID_NOTFOUND;
			}
		}

	}

	
	finish(id:string):number {
		for(var i = 0; i < this.taskList.length; i++) {
			if(this.taskList[i].id == id) {
				this.taskList[i].status = TaskStatus.SUBMITTED;
				this.notify(this.taskList[i]);
				return ErrorCode.NO_ERRIR;
				
			}else if(i == this.taskList.length - 1) {
				return ErrorCode.ID_NOTFOUND;
			}
		}
		
	}

	getTaskByCustomRole(rule:Function,Id:string):Task {
		return rule(this.taskList,Id);

	}

	notify(task:Task) {
		for(var i = 0; i < this.observerList.length; i++) {
				this.observerList[i].onChange(task);

		}
	}



}