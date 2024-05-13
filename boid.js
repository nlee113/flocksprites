//Boid Class
class Boid {
    constructor(boid_json, x, y, start_state) {
        this.x = x;
        this.y = y;
        this.v_x = this.randnum(-5.5, 5.5);
        this.v_y = this.randnum(-5.5, 5.5);
        this.a_x = 0;
        this.a_y = 0;
        this.max_a = .2;
        this.max_v = 4;

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

    // Alignment
    align(boids) {
        let perceptionRadius = 100;
        let steer_x = 0;
        let steer_y = 0;
        let total = 0;
        for (let others of boids) {
            let gap_x = Math.abs(others.x - this.x)
            let gap_y = Math.abs(others.y - this.y)
            if (others != this && gap_x <= perceptionRadius && gap_y <= perceptionRadius) {
                steer_x += others.v_x;
                steer_y += others.v_y;
                total++;
            }
        }
        if (total > 0) {
            steer_x = steer_x / total;
            steer_y = steer_y / total;
            [steer_x, steer_y] = this.setMag(steer_x, steer_y)
            steer_x -= this.v_x;
            steer_y -= this.v_y;
            [steer_x, steer_y] = this.setLimit(steer_x, steer_y)
            this.a_x += steer_x;
            this.a_y += steer_y;

        }
    }

    // Cohesion
    cohesion(boids) {
        let perceptionRadius = 100;
        let steer_x = 0;
        let steer_y = 0;
        let total = 0;
        for (let others of boids) {
            let gap_x = Math.abs(others.x - this.x)
            let gap_y = Math.abs(others.y - this.y)
            if (others != this && gap_x <= perceptionRadius && gap_y <= perceptionRadius) {
                steer_x += others.x;
                steer_y += others.y;
                total++;
            }
        }
        if (total > 0) {
            steer_x = steer_x / total;
            steer_y = steer_y / total;
            steer_x -= this.x;
            steer_y -= this.y;
            [steer_x, steer_y] = this.setMag(steer_x, steer_y)
            steer_x -= this.v_x;
            steer_y -= this.v_y;
            [steer_x, steer_y] = this.setLimit(steer_x, steer_y)
            this.a_x += steer_x;
            this.a_y += steer_y;

        }
    }

    // Separation
    seperation(boids) {
        let perceptionRadius = 100;
        let steer_x = 0;
        let steer_y = 0;
        let total = 0;
        for (let others of boids) {
            let gap_x = Math.abs(others.x - this.x)
            let gap_y = Math.abs(others.y - this.y)
            if (others != this && gap_x <= perceptionRadius && gap_y <= perceptionRadius) {
                let diff_x = this.x - others.x;
                let diff_y = this.y - others.y;
                if(gap_x == 0){
                    diff_y /= gap_y;
                }
                else if(gap_y == 0){
                    diff_x /= gap_x;
                }
                else{
                    diff_x /= gap_x;
                    diff_y /= gap_y;
                }
                
                steer_x += diff_x;
                steer_y += diff_y;
                total++;
            }
        }
        if (total > 0) {
            steer_x = steer_x / total;
            steer_y = steer_y / total;
            [steer_x, steer_y] = this.setMag(steer_x, steer_y)
            steer_x -= this.v_x;
            steer_y -= this.v_y;
            [steer_x, steer_y] = this.setLimit(steer_x, steer_y)
            steer_x *= 1.25;
            steer_y *= 1.25;
            this.a_x += steer_x;
            this.a_y += steer_y;

        }
    }
    

    setMag(v_x, v_y) {
        let magnitude = Math.sqrt(v_x * v_x + v_y * v_y);
        if (magnitude > 0) {
            v_x = (v_x / magnitude) * this.max_v;
            v_y = (v_y / magnitude) * this.max_v;
        }
        return [v_x, v_y];
    }

    setLimit(v_x, v_y) {
        if (v_x > this.max_a) {
            v_x = this.max_a;
        }
        else if (v_x < (this.max_a * -1)) {
            v_x = this.max_a * -1
        }

        if (v_y > this.max_a) {
            v_y = this.max_a;
        }
        else if (v_y < (this.max_a * -1)) {
            v_y = this.max_a * -1
        }

        return [v_x, v_y];
    }

    update() {
        //console.log("XVELO:" + this.v_x + " YVELO:" + this.v_y)
        this.x += this.v_x;
        this.y += this.v_y;
        this.v_x += this.a_x;
        this.v_y += this.a_y;
    }
    
    bounds_hit(direction) {

        switch (direction) {
            case 'W':
                //console.log("test");
                this.x += 3;
                this.v_x *= -1;
                break;
            case 'N':
                this.y += 3;
                this.v_y *= -1;
                break;
            case 'E':
                this.x -= 3;
                this.v_x *= -1;
            case 'S':
                this.y -= 3;
                this.v_y *= -1;
        }
    }
    draw(allboids) {
        var ctx = canvas.getContext('2d');

        if (this.boid_json[this.root_e][this.state][this.cur_frame]['img'] == null) {
            console.log("loading");
            this.boid_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.boid_json[this.root_e][this.state][this.cur_frame]['img'].src = 'magikarp/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }
        ctx.drawImage(this.boid_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y);
        this.cur_frame = this.cur_frame + 1;

        if (this.cur_frame >= this.boid_json[this.root_e][this.state].length) {
            this.cur_frame = 0;
        }

        // BOID BOUNDS 
        var map_context = offscreen.getContext('2d');
        var topright_corner_x = this.x + this.boid_json[this.root_e][this.state][this.cur_frame]['w'];
        var botleft_corner_y = this.y + this.boid_json[this.root_e][this.state][this.cur_frame]['h'];
        var corner1_data = map_context.getImageData(this.x, this.y, 1, 1).data; //data of topleft corner
        var corner2_data = map_context.getImageData(topright_corner_x, this.y, 1, 1).data; //data of topright corner
        var corner3_data = map_context.getImageData(this.x, botleft_corner_y, 1, 1).data; //data of botleft corner
        var corner4_data = map_context.getImageData(topright_corner_x, botleft_corner_y, 1, 1).data; //data of botright corner
        // W, green
        if ((corner1_data[0] == 0 && corner1_data[1] == 255 && corner1_data[2] == 0) || (corner3_data[0] == 0 && corner3_data[1] == 255 && corner3_data[2] == 0)) {
            this.bounds_hit('W');
            console.log("GREEN HIT");
        }
        // N, yellow
        else if ((corner1_data[0] == 255 && corner1_data[1] == 255 && corner1_data[2] == 0) || (corner2_data[0] == 255 && corner2_data[1] == 255 && corner2_data[2] == 0)) {
            this.bounds_hit('N');
            console.log("YELLOW HIT");
        }
        // E, red
        else if ((corner4_data[0] == 255 && corner4_data[1] == 0 && corner4_data[2] == 0) || (corner2_data[0] == 255 && corner2_data[1] == 0 && corner2_data[2] == 0)) {
            this.bounds_hit('E');
            console.log("RED HIT");
        }
        // S, teal
        else if ((corner4_data[0] == 0 && corner4_data[1] == 255 && corner4_data[2] == 255) || (corner3_data[0] == 0 && corner3_data[1] == 255 && corner3_data[2] == 255)) {
            this.bounds_hit('S');
            console.log("TEAL HIT");
        }
        else {
            this.a_x = this.a_y = 0;
            this.seperation(allboids);
            this.align(allboids);
            this.cohesion(allboids);
            this.update();
        }

    }

}