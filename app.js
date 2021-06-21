var c = document.createElement("canvas");
var ctx = c.getContext("2d");
c.width = 1000;
c.height = 500;

var background = new Image();
background.src = "images/rikadai.jpg";

//画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
//background.onload = function(){
    //canvas_widthを height / width倍する.
//ctx.drawImage(background,0,0,c.width, background.height * c.width / background.width);
//}

var size = 15;

let imgName = ['images/1.png', 'images/2.png'];

document.body.appendChild(c);

var perm = [];

while (perm.length < 255) {
    while (perm.includes(val = Math.floor(Math.random()*2 * 255)));
    perm.push(val);
}


var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;

var noise = x => {
    x = x * 0.01 % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

var player = new function() {
    this.x = c.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;

    this.img = new Image();
    this.img.src = "images/moto.png"

    this.draw = function() {
        var p1 = c.height - noise(t + this.x) * 0.25;
        var p2 = c.height - noise(t + 5 + this.x) * 0.25;

        var grounded = 0;

        if(p1 - size*1.1 > this.y) {
            this.ySpeed += 0.1;
        } else {
            //this.ySpeed -= this.y - (p1 -size);
            this.ySpeed = 0;
            this.y = p1 - size;

            grounded = 1;
        }

        if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5) {
            playing = false;
            this.rSpeed = 5;
            k.ArrowUp = 1;
            this.x -= speed * 5
        }

        var angle = Math.atan2((p2 - size) - this.y, (this.x + 5) - this.x)

        //this.rot = angle;

        this.y += this.ySpeed;

        if(grounded && playing) {
            this.rot -= (this.rot - angle) * 0.5;
            this.rSpeed = 0.8*(this.rSpeed - (angle - this.rot));
            //this.ySpeed = -k.v*7;
        }

        if(p1 - size*2 < this.y  && playing) {
            this.ySpeed = -k.v*7;
        }
        
        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        if (grounded) {
            this.x += (k.ArrowUp - k.ArrowDown) * 7;
            //this.y = p1 - size;
            this.y = c.height - noise(t + this.x) * 0.25 - size*0.9;
        }
        this.rot -= this.rSpeed * 0.08;

        if(this.rot > Math.PI) this.rot = -Math.PI;
        if(this.rot < -Math.PI) this.rot = Math.PI;
 
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -15, -15, 30, 30);
        ctx.restore();
    }
}

var enemy = new function() {
    //this.x = c.width / 2;
    this.x = Math.random() * c.width;
    this.y = 0;
    this.ySpeed = 0;

    this.img = new Image();
    var a = Math.floor( Math.random());
    //this.img.src = "images/1.png"
    this.img.src = imgName[a];

    this.draw = function() {
        var p1 = c.height - noise(t + this.x) * 0.25;
        var p2 = c.height - noise(t + 5 + this.x) * 0.25;

        var grounded = 0;

        if(p1 - size > this.y) {
            //this.ySpeed += 0.1 * (1 + Math.floor(distance/100));
            this.ySpeed += 0.1;
        } else {
            this.ySpeed -= this.y - (p1 -size);
            this.y = p1 - size;

            grounded = 1;
        }

        this.y += this.ySpeed;

        if (grounded) {
            this.y = 0;
            this.x = Math.random() * c.width;
            a = Math.floor( Math.random()*2);
            this.img.src = imgName[a];
            console.log(a)
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -15, -15, 100, 30);

        ctx.restore();
    }
}

var t = 0;
var defaultSpeed = 0.5;
var speedDiff = 0;
var speed = 0.5;
var playing = true;
var k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0, v: 0};
var distance = 0;
var text;

/*document.body.addEventListener('space',
    event => {
        if (event.key === 'v' && event.ctrlKey) {
           alert("Ctrl+Vが押されました")
        }
    });*/
function detectTouch(first, second) {

    var objSize = 50;
    if((second.x < first.x + objSize && first.x - objSize < second.x) && (first.y < second.y)) {
        playing = false;
        //console.log("x : " + first.x + " y : " + first.y + "\n");
        //console.log("x : " + second.x + " y : " + second.y + "\n");
    }

}

function loop() {

    //speedDiff -= (speedDiff - (k.ArrowUp - k.ArrowDown)) * 0.1;
    //speed = defaultSpeed + speedDiff;
    speed = defaultSpeed;
    //player.x += (k.ArrowUp - k.ArrowDown) * 0.1;
    t += 10 * speed;
    distance += speed;


    ctx.drawImage(background,0,0,c.width, background.height * c.width / background.width);

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.moveTo(0, c.height);

    for (var i = 0; i< c.width; i++) {
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    }

    ctx.lineTo(c.width, c.height)


    //距離を表示
    text = "distance : " + distance;
    ctx.fillText(text, c.width-200, 50);
    
    ctx.font = '20pt Arial';

    ctx.fill();

    player.draw();

    if (distance > 100) {
        enemy.draw();
    }

    detectTouch(player, enemy);

    //var enemy1 = new enemy();
    //const enemy1 = enemy();
    //enemy1.draw();
    //const enemy2 = new enemy
    //enemy2.draw();
    
    if (playing == true) {
        requestAnimationFrame(loop);
    } else {
        const open = document.getElementById('open');
        const close = document.getElementById('close');
        const modal = document.getElementById('modal');
        const mask = document.getElementById('mask');

        modal.classList.remove('hidden');
        mask.classList.remove('hidden');

        var comment = "<div><br>あなたの記録は" + Math.floor(distance) + "です</div>";
        if (distance < 100) {
            var comment2 = "<div>しょぼっ!!</div>"
        } else if(distance <= 500) {
            var comment2 = "<div>まあまあかな</div>"
        } else {
            var comment2 = "<div>すげえ!!</div>"
        }
        
        close.insertAdjacentHTML('beforebegin', comment);
        close.insertAdjacentHTML('beforebegin', comment2);

        close.addEventListener('click',()=>{
        window.location.reload();
        });
    }
}

onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;

loop();

//結果をツイート機能
var tweet = document.getElementById('tweet');
var tweetUrl = 'https://twitter.com/intent/tweet?text='+
  encodeURIComponent(
    '記録は' + distance + 'でした'
  ) + '&hashtags = シズゲー';