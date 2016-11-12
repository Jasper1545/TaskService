var npcBitmap = {

	npc_0:"player01_idle_left_png",
	npc_1:"player01_idle_right_png"

}

class NPC implements Observer{

	public npcStage:egret.DisplayObjectContainer;

	taskService:TaskService;

	task:Task;

	npcId:string;
	npcName:string;

	emoji:egret.Bitmap;
	tileSize:number = 64;
	emojiX:number = 0;
	emojiY:number = 64;

	npcStageShape:egret.Shape;
	npcStageX :number;
	npcStageY :number;
	npcStageWidth = 64;
	npcStageHeight = 128;
	npcStageColor:number;

	taskNoneState:State;
	taskAvilableState:State;
	taskSubmitState:State;
	taskStateMachine:StateMachine;

	public constructor(npcId:string,npcName:string,taskService) {
		this.npcStage = new egret.DisplayObjectContainer();
		this.npcStageShape = new egret.Shape();
		this.emoji = new egret.Bitmap();
		this.npcId = npcId;
		this.npcName = npcName;
		this.taskService= taskService;
		this.taskService.addObserver(this,"NPC");

		this.taskNoneState = new TaskNoneState(this);
		this.taskAvilableState = new TaskAvilableState(this);
		this.taskSubmitState = new TaskSubmitState(this);

		this.taskStateMachine = new StateMachine(this.taskNoneState);

	}

	getTask() {
		this.task = this.taskService.getTaskByCustomRole(this.rule,this.npcId);
		console.log("This Task State: "+ this.task.status);
		this.checkState();
	}

	setemoji() {
		this.emoji.texture = RES.getRes(npcBitmap.npc_0);
		this.emoji.x = this.emojiX;
		this.emoji.y = this.emojiY;
		this.emoji.width= this.tileSize;
		this.emoji.height = this.tileSize;
	}

	setNpc(npcX:number,npcY:number,npcColor:number){
		this.npcStageX = npcX;
		this.npcStageY = npcY;
		this.npcStageColor = npcColor;

		this.setemoji();
	}

	drawNpcShape(){
		this.npcStageShape.graphics.beginFill(this.npcStageColor,1);
		this.npcStageShape.graphics.drawRect(0,0,this.npcStageWidth,this.npcStageHeight);
		this.npcStageShape.graphics.endFill();
		
	}

	drawNpc() {
		this.drawNpcShape();

		this.npcStage.x = this.npcStageX;
		this.npcStage.y = this.npcStageY;
		this.npcStage.width = this.npcStageWidth;
		this.npcStage.height = this.npcStageHeight;

		this.npcStage.addChild(this.npcStageShape);
		this.npcStage.addChild(this.emoji);
		this.emoji.touchEnabled = true;
		//this.npcStage.touchEnabled = true;
		this.emoji.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onNpcClick,this);
	}

	checkState() {
		switch(this.task.status) {
			case TaskStatus.UNACCEPTABLE:
			case TaskStatus.DURING:
			case TaskStatus.SUBMITTED:
				this.taskStateMachine.changeState(this.taskNoneState);
				break;

			case TaskStatus.ACCEOTABLE:
				if(this.task.fromNpcId == this.npcId) {
					this.taskStateMachine.changeState(this.taskAvilableState);
				}else {
					this.taskStateMachine.changeState(this.taskNoneState);
				}
				break;

			case TaskStatus.CAN_SUBMIT:
				if(this.task.toNpcId == this.npcId) {
					this.taskStateMachine.changeState(this.taskSubmitState);
				}else {
					this.taskStateMachine.changeState(this.taskNoneState);
				}
				break;

		}

	}

	onNpcClick(e:egret.TouchEvent) {
		if(this.task.status == TaskStatus.ACCEOTABLE && this.task.fromNpcId == this.npcId){
			this.taskService.notifyTaskPanel(this.task);

		}else if(this.task.status == TaskStatus.CAN_SUBMIT && this.task.toNpcId == this.npcId) {
			this.taskService.notifyTaskPanel(this.task);
		}
	}

	onChange(task:Task) {
		this.task = task;
		this.checkState();
	}

	rule(taskList:Task[],npcId:string):Task {
		for(var i = 0; i<taskList.length; i++) {
			if(taskList[i].fromNpcId == npcId || taskList[i].toNpcId == npcId) {
				console.log("Find");
				return taskList[i];

			}
		}
	}

}

