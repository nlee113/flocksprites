//Parent Sprit Class
class Sprite {
    // ... 
    constructor(sprite_json, x, y, start_state){
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "poke";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.x_v = 10;
        this.y_v = 0;

        this.bound_x = 0;
        this.bound_y = 0;
        this.idle_state = ["idle","idleSpin","idleMagic"];
        this.in_idle = 0;
    }
    
    velocity() {
        if (this.state == "set_walk_N") {
            this.x_v = 0;
            this.y_v = -7;
        }
        else if (this.state == "set_walk_E") {
            this.x_v = 7;
            this.y_v = 0;
        }
        else if (this.state == "set_walk_S") {
            this.x_v = 0;
            this.y_v = 7;
        }
        else if (this.state == "set_walk_W") {
            this.x_v = -7;
            this.y_v = 0;
        }
        else {
            this.x_v = 0;
            this.y_v = 0;
        }

    }

    draw(new_state){
        var ctx = canvas.getContext('2d');

        if( this.cur_bk_data != null){
            ctx.putImageData(this.cur_bk_data , (this.x - (this.x_v + this.bound_x)) , (this.y - (this.y_v + this.bound_y)));
            this.bound_x = 0
            this.bound_y = 0
        }

        //console.log(this.sprite_json[this.root_e][this.state][this.cur_frame]['w']);
        if (this.idle_state.includes(new_state)) {
            if (this.in_idle == 0) {
                this.set_idle_state();
            }
        }
        else {
            this.state = new_state;
            this.in_idle = 0;
        }

        if (this.cur_frame >= this.sprite_json[this.root_e][this.state].length) {
            this.cur_frame = 0;
        }
        this.velocity();

        if(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null){
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = 'sprite_girl/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        this.cur_bk_data = ctx.getImageData(this.x, this.y, 
                        this.sprite_json[this.root_e][this.state][this.cur_frame]['w'] + 5, 
                        this.sprite_json[this.root_e][this.state][this.cur_frame]['h'] + 5);

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y );
        this.cur_frame = this.cur_frame + 1;

        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }
        // attempted but did not finish... future implementation: add bounds to coordinate with bk2_bounds3.png
        if(this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) ){
            this.x--;
            this.bound_x = -1;
            this.bound_hit('E');
        }else if(this.x <= 0){
            this.x++;
            this.bound_x = 1;
            this.bound_hit('W');
        }else if(this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) ){
            this.y--;
            this.bound_y = -1;
            this.bound_hit('S');
        }else if(this.y <= 0){
            this.y++;
            this.bound_y = 1;
            this.bound_hit('N');
        }else{
            this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;
        }
    }

    set_idle_state(){
        if(this.in_idle == 0)
        this.x_v = 0;
        this.y_v = 0;
        const random = Math.floor(Math.random() * this.idle_state.length);
        this.state = this.idle_state[random];
        this.cur_frame = 0;
        this.in_idle = 1;
    }

    bound_hit(side){
            this.set_idle_state();
   }
}