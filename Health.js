class Health{
	constructor(hp){
		this.hp = hp;
		this.img = loadImage("Img/heart.png")
	}

	damage(){
		this.hp--;
		curFrame += frameCount/3;
	}

	display(){
		for(var i = 0;i<this.hp;i++){
			image(this.img,trex.x + i * 40,40,30,30);
		}
	}

	dead(){
		if(this.hp < 0){
			return true;
		}else if(this.hp > 0){
			return false;
		}
	}
	
	revive(hp){
		this.hp = hp;
	}
}
