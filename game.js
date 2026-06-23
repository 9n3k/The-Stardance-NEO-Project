let player;
let monsters = [];
let notifications = [];
let totalCredits = 0;

let upgradesInstalled = {
    hull: false,
    shield: false
};

const CANVAS_WIDTH = 840;
const CANVAS_HEIGHT = 520;

function setup() {
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');
    
    player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50);
    
    updateShopButtons();
    
  
    const statusElement = document.getElementById('tracking-status');
    if (statusElement) {
        statusElement.innerText = "Controls: WASD Keyboard Active ⌨️";
        statusElement.style.color = "var(--neon-blue)";
    }
}

function draw() {
    background(11, 15, 25);
    

    fill(255, 255, 255, 130);
    for(let i = 0; i < 25; i++) {
        let x = noise(i, frameCount * 0.001) * CANVAS_WIDTH;
        let y = noise(i * 12, frameCount * 0.001) * CANVAS_HEIGHT;
        ellipse(x, y, 2, 2);
    }


    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {    
        player.y -= player.speed;
    }
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {  
        player.y += player.speed;
    }
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {  
        player.x -= player.speed;
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
        player.x += player.speed;
    }

    player.update();
    player.display();


    if (frameCount % 45 === 0) {
        monsters.push(new Monster());
    }

    for (let i = monsters.length - 1; i >= 0; i--) {
        monsters[i].update();
        monsters[i].display();

        if (player.collidesWith(monsters[i])) {
            totalCredits += 1;
            document.getElementById('credits-val').innerText = totalCredits;
            notifications.push(new PopAlert(monsters[i].x, monsters[i].y, "+1 Credit"));
            monsters.splice(i, 1);
            updateShopButtons();
            continue;
        }

        if (monsters[i].x < -50) {
            monsters.splice(i, 1);
        }
    }

    for (let i = notifications.length - 1; i >= 0; i--) {
        notifications[i].update();
        notifications[i].display();
        if (notifications[i].isDead()) {
            notifications.splice(i, 1);
        }
    }
}

class PopAlert {
    constructor(x, y, message) {
        this.x = x;
        this.y = y;
        this.msg = message;
        this.alpha = 255;
        this.speed = 1.8;
    }
    update() {
        this.y -= this.speed;
        this.alpha -= 5;
    }
    display() {
        noStroke();
        fill(0, 255, 102, this.alpha);
        textSize(12);
        textAlign(CENTER, CENTER);
        text(this.msg, this.x, this.y);
    }
    isDead() { return this.alpha <= 0; }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 36;
        this.speed = 5.5;
    }
    update() { 

        this.x = constrain(this.x, 30, CANVAS_WIDTH - 30); 
        this.y = constrain(this.y, 30, CANVAS_HEIGHT - 30);
    }
    display() {
        rectMode(CENTER);

        if (upgradesInstalled.shield) {
            noFill();
            stroke('#00ff66');
            strokeWeight(2);
            ellipse(this.x, this.y, this.size + 30);
        }

        stroke(upgradeInstalled.hull ? '#00d9ff' : '#00ff66');
        strokeWeight(3);
        fill(22, 27, 38);

        rect(this.x, this.y, this.size, this.size, 4);

        noStroke();
        fill('#ffffff');
        textSize(10);
        textAlign(CENTER, CENTER);
        text("SHIP", this.x, this.y);
    }
    collidesWith(other) {
        let rangeCheckDistance = upgradesInstalled.shield ? (this.size / 2 + 15 + other.size / 2) : (this.size / 2 + other.size / 2);
        let currentDistance = dist(this.x, this.y, other.x, other.y);
        return currentDistance < rangeCheckDistance;
    }
}

class Monster {
    constructor() {
        this.x = CANVAS_WIDTH + 50;
        this.y = random(70, CANVAS_HEIGHT - 70);
        this.speed = random(2.5, 5.5);
        this.size = 44;
    }
    update() { this.x -= this.speed; }
    display() {
        stroke('#ff3333');
        strokeWeight(2);
        fill(35, 20, 30);
        rectMode(CENTER);

        rect(this.x, this.y, this.size, this.size, 4);

        noStroke();
        fill('#ff3333');
        textSize(9);
        textAlign(CENTER, CENTER);
        text("ASTEROID", this.x, this.y);
    }
}

function purchaseEquipment(itemId, pricingCost) {
    if (totalCredits >= pricingCost && !upgradesInstalled[itemId]) {
        totalCredits -= pricingCost;
        upgradesInstalled[itemId] = true;
        
        document.getElementById('credits-val').innerText = totalCredits;
        document.getElementById(`buy-${itemId}`).classList.add('hidden');
        document.getElementById(`owned-${itemId}`).classList.remove('hidden');
        
        updateShopButtons();
    }
}

function updateShopButtons() {
    let items = [{ id: 'hull', cost: 15 }, { id: 'shield', cost: 40 }];
    items.forEach(item => {
        let btnRef = document.getElementById(`buy-${item.id}`);
        if (btnRef) {
            btnRef.disabled = (totalCredits < item.cost || upgradesInstalled[item.id]);
        }
    });
}
