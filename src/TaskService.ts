var ErrorCode = {

	NO_ERRIR:0,
	ID_NOTFOUND:1
}

class ObserverWithType{

	observer:Observer;
	type:string;

	constructor(observer:Observer,type:string) {
		this.observer = observer;
		this.type = type;
	}

}

class TaskService {

	observerList:ObserverWithType[];
	taskList:Task[];

	task01:Task;

	public constructor() {
		this.observerList = new Array();
		this.taskList = new Array();
		this.task01 = new Task("000","Task000","Go to NPC_2",TaskStatus.ACCEOTABLE,"npc_0","npc_1");
		this.taskList.push(this.task01);
	}

	addObserver(observer:Observer,type:string) {
		this.observerList.push(new ObserverWithType(observer,type));
	}

	accept(id:string):number {
		for(var i = 0; i < this.taskList.length; i++) {
			if(this.taskList[i].id == id) {
				console.log("Find Task: " + this.taskList[i].id);
				this.taskList[i].status = TaskStatus.CAN_SUBMIT;
				this.notifyNpc(this.taskList[i]);
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
				this.notifyNpc(this.taskList[i]);
				return ErrorCode.NO_ERRIR;
				
			}else if(i == this.taskList.length - 1) {
				return ErrorCode.ID_NOTFOUND;
			}
		}
		
	}

	getTaskByCustomRole(rule:Function,Id:string):Task {
		return rule(this.taskList,Id);

	}


	notifyTaskPanel(task:Task) {
		for(var i =0; i < this.observerList.length; i++) {
			if(this.observerList[i].type == "TaskPanel") {
				this.observerList[i].observer.onChange(task);

			}
		}		
	}

	notifyNpc(task:Task) {
		for(var i = 0; i < this.observerList.length; i++) {
			console.log("Type:"+ this.observerList[i].type);
			if(this.observerList[i].type == "NPC") {
				console.log("Find NPC");
				this.observerList[i].observer.onChange(task);
						
			}
		}

	}



}