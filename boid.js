//Boid Class
class Boid{
    constructor(boid_json, x, y, start_state){
        this.x = x;
        this.y = y;
        this.v_x = this.randnum(-1.5,1.5);
        this.v_y = this.randnum(-1.5,1.5);
        this.a_x = 0;
        this.a_y = 0;

        this.boid_json = boid_json;
        this.state = start_state;
        this.root_e = "poke";

        this.cur_frame = 0;
        this.bound_x = 0;
        this.bound_y = 0;

        this.cur_bk_data = null;
    }

    randnum(min, max) {
        return Math.random() * (max - min) + min;
    }

    align(boids){
        let perceptionRadius = 100;
        let steer_x = 0;
        let steer_y = 0;
        let total = 0;
        for(let others of boids){
            //console.log("STTER" + steer_x);
            let gap_x = Math.abs(others.x - this.x)
            let gap_y = Math.abs(others.y - this.y)
            //console.log("GAP " + gap_x + "," + gap_y)
            if(others != this && gap_x <= perceptionRadius && gap_y <= perceptionRadius){
                steer_x += others.v_x;
                steer_y += others.v_y;
                total++;
            }
        }
        if( total > 0){
            steer_x = steer_x/total;
            steer_y = steer_y/total;
            steer_x -= this.v_x;
            steer_y -= this.v_y;
            this.a_x = steer_x;
            this.a_y = steer_y;
        }
    }

    update(){
        this.x += this.v_x;
        this.y += this.v_y;
        //console.log(this.a_x);
        this.v_x += this.a_x;
        this.v_y += this.a_y;
        
    }
    draw(){
        var ctx = canvas.getContext('2d');

        if(this.cur_bk_data != null){
            ctx.putImageData(this.cur_bk_data ,this.x - this.v_x ,this.y - this.v_y);
            this.bound_x = 0
            this.bound_y = 0
        }

        if(this.boid_json[this.root_e][this.state][this.cur_frame]['img'] == null){
            console.log("loading");
            this.boid_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.boid_json[this.root_e][this.state][this.cur_frame]['img'].src = 'magikarp/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        this.cur_bk_data = ctx.getImageData(this.x, this.y, 
            this.boid_json[this.root_e][this.state][this.cur_frame]['w'] + 5, 
            this.boid_json[this.root_e][this.state][this.cur_frame]['h'] + 5);

        ctx.drawImage(this.boid_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y );
        this.cur_frame = this.cur_frame + 1;

        if(this.cur_frame >= this.boid_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }
        
        var map_context = offscreen.getContext('2d');
        var topright_corner_x = this.x + this.boid_json[this.root_e][this.state][this.cur_frame]['w'];
        var botleft_corner_y = this.y + this.boid_json[this.root_e][this.state][this.cur_frame]['h'];
        var corner1_data = map_context.getImageData( this.x, this.y, 1, 1).data; //data of topleft corner
        var corner2_data = map_context.getImageData( topright_corner_x, this.y, 1, 1).data; //data of topright corner
        var corner3_data = map_context.getImageData( this.x, botleft_corner_y, 1, 1).data; //data of botleft corner
        var corner4_data = map_context.getImageData( topright_corner_x, botleft_corner_y , 1, 1).data; //data of botright corner
        
        //console.log(corner1_data);
        /*
        if(corner1_data[2] != 255){
            this.bounds_x = this.v_x;
            this.bounds_y = this.v_y;
            this.v_x = 0;
            this.v_y = 0;
        }  
        */

        this.update();
    }
    
}