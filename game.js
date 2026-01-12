// Suzdavame promenlivi
let myX, myY;
let g=-9.80665; // gravitational acceleration
let testangle=Math.PI,testVelocity=0;
let testangle2=Math.PI/2,testVelocity2=0;
let updates=0
let pixelratio=3779.5275591
let dt=0.0005
let length=0.02;
let R=0.05;
let angles=[]
let velocitys=[]
let dangle=[]
let br=2
let m=0.1
let q=150

let positions=[]


for(let i=0;i<br;i++){
    angles.push(Math.PI/2);
    velocitys.push(0);
    
}
angles[0]=Math.PI;
//angles[1]=1.4825727771948736;
dangle=angles




function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    myX = 300;
    myY = 300;
}



function saveArrayToFile(array, filename) {
     // Convert array to a string (one element per line)
    const data = array.join('\n');
    
    // Create a Blob with the data
    const blob = new Blob([data], { type: 'text/plain' });
    
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Trigger the download
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
}

function drawPendulum(x,y,angle,length,i=1){
    let xEnd = x + length * Math.cos(angle);
    let yEnd = y + length * Math.sin(angle);
    context.beginPath()
    context.moveTo(x,y);
    context.lineTo(xEnd,yEnd);
    let width = 30, height = 60;
    context.stroke();
    context.save(); // Save the current state
    context.translate(xEnd , yEnd ); // Translate to the rectangle's center
    context.rotate(angle); // Rotate by 45 degrees (adjust angle as needed)
    context.fillStyle = "rgb("+255*(i%2)+",0,"+255*((i+1)%2)+")";
    context.fillRect(-width / 2, -height / 2, width, height/2); // Draw centered on origin
    
    context.fillStyle = "rgb("+255*((i+1)%2)+",0,"+255*((i)%2)+")";
    context.fillRect(-width/2, 0, width, height/2);
    context.restore();
}
function VecMulti2(a,b){
    return a[0]*b[0]+a[1]*b[1];
}
function VecMultiNum(vector,number){
    return [vector[0]*number,vector[1]*number];
}
function howmuchVector1on2(vector1,vector2){
    return (VecMulti2(vector1,vector2))/(Math.sqrt(vector2[0]**2+vector2[1]**2));
}

function VecAdd(vectors){
 let br=vectors.length;   
 let finalVec=[0,0];
    for(let i=0;i<br;i++){
    finalVec[0]+=vectors[i][0];
    finalVec[1]+=vectors[i][1];    
    }
    return finalVec;
}
function VecLen(vector){
    return Math.sqrt(vector[0]**2+vector[1]**2);
}
function MagneticForceFormula(x1,y1,x2,y2,q1,q2,v1,v2){
let k=8.9875517923*Math.pow(10,9);
k=10**-7
let r=Math.sqrt((x2-x1)**2+(y2-y1)**2);
let rVector=[(x2-x1)/r,(y2-y1)/r];
let d=0.01;
let p1=VecMultiNum(v1,q1*d);
let p2=VecMultiNum(v2,q2*d);

let force=VecMultiNum(VecAdd([  VecMultiNum(rVector,VecMulti2(p1,p2))   ,    VecMultiNum(p2,VecMulti2(p1,rVector))   ,   VecMultiNum(p1,VecMulti2(p2,rVector)) ,  VecMultiNum(VecMultiNum(rVector,  VecMulti2(p1,rVector)*VecMulti2(p2,rVector)   ),-5)   ])
,(3/(r**4))*k);

return force;
}

function ForceFormula(mass, gravity, length,R, angle1,angle2,q1,q2){
    let Gr= Math.round(((gravity*mass) * Math.sin(angle1-Math.PI/2))*100000000000000)/100000000000000;
    let pos1=[R*Math.cos(angle1),R*Math.sin(angle1)];
    let pos2=[R*Math.cos(angle2)+length,R*Math.sin(angle2)];
    let v1=[-Math.sin(angle1),Math.cos(angle1)];
    let v2=[-Math.sin(angle2),Math.cos(angle2)];
    v1=[1,0]
    v2=[-1,0]
    let Mforce=VecMultiNum(MagneticForceFormula(pos1[0],pos1[1],pos2[0],pos2[1],q1,q2,v1,v2),-1);
    let Ftotal=Gr+howmuchVector1on2(Mforce, v1);
    
    return Ftotal;
}
function angularAccelerationFormula(force,mass,R){
    return force/(mass*R);
}




function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
    myX = myX + (mouseX - myX) / 10;
    myY = myY + (mouseY - myY) / 10;
    
    updates++
    if(updates%100==0){
     console.log(updates/100)

    }

    for(let i=0;i<br;i++){
        
        for(let j=-1;j<=1;j+=2){
        if(i+j<0 || i+j>=br){continue};
        let a= function (x){return angularAccelerationFormula(ForceFormula(m,g,j*length,R,x,angles[i+j],(1-2*(i%2))*q,-(1-2*(i%2))*q),m,R)}
        let theta = angles[i];      // angle
let omega = velocitys[i];  // angular velocity

// k1
let k1_theta = omega;
let k1_omega = a(theta);

// k2
let theta2 = theta + k1_theta * dt / 2;
let omega2 = omega + k1_omega * dt / 2;
let k2_theta = omega2;
let k2_omega = a(theta2);


// finite difference method


// k3
let theta3 = theta + k2_theta * dt / 2;
let omega3 = omega + k2_omega * dt / 2;
let k3_theta = omega3;
let k3_omega = a(theta3);

// k4
let theta4 = theta + k3_theta * dt;
let omega4 = omega + k3_omega * dt;
let k4_theta = omega4;
let k4_omega = a(theta4);

// update
dangle[i]+= (dt / 6) * (k1_theta + 2*k2_theta + 2*k3_theta + k4_theta);
velocitys[i] += (dt / 6) * (k1_omega + 2*k2_omega + 2*k3_omega + k4_omega);
        

}}







positions[positions.length]=[];
for(let i=0;i<br;i++){

positions[positions.length-1][i]=[];
}


for(let i=0;i<br;i++){
    angles[i] = dangle[i]
    positions[positions.length-1][i].push(angles[i]);
    positions[positions.length-1][i].push(velocitys[i]);

}

}


function draw() {
    // Tuk naprogramirai kakvo da se risuva
    //drawImage(backField, 0, 0, 800, 600);
  //  drawImage(femaleAction, myX, myY, 60, 80);
    for(let i=0;i<br;i++){
    drawPendulum((R+i*length)*pixelratio,100,angles[i],R*pixelratio,i);    
    }
}
function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
}
function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
}

