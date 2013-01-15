
function drawProgress(canvas, percent){
	var c = $(canvas);
	var ctx = c[0].getContext("2d");
	var w = ctx.canvas.width;
	var h = ctx.canvas.height;
	var center_w = w / 2;
	var center_h = h / 2;
	
	if(percent == undefined){
		percent = c.attr('percent') ? c.attr('percent') : 0;
		}
	
	percent = Math.round(percent);
	
	c.attr('percent', percent);
	
	ctx.clearRect(0, 0, w, h);
	
	ctx.save()
	
	// make 0% at the top
	ctx.rotate(-90 * Math.PI / 180);
	ctx.translate(-h, 0);
	
	
	// outer circle
	ctx.beginPath();
	ctx.arc(center_w, center_h, center_w/2, 0, (percent / 50) * Math.PI);
	
	ctx.lineWidth = center_w;
	
	var grd = ctx.createLinearGradient(0, 0, w, 0);
	grd.addColorStop(0.4, "#FFAD33");
	grd.addColorStop(1, "#FFE6C1");
	
	ctx.strokeStyle = grd;//"#FFAD33";
	ctx.stroke();
	
	
	// center whiteout
	ctx.save()
	ctx.beginPath();
	ctx.arc(center_w, center_h, center_w/2, 0, 2 * Math.PI);
	
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = "#000";
	ctx.fill();
	ctx.restore();
	
	
	// center stroke
	ctx.beginPath();
	ctx.arc(center_w, center_h, center_w/2, 0, (percent / 50) * Math.PI);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";
	ctx.stroke();
	
	ctx.restore();
	
	// center read-out
	ctx.font = c.css('font-size') + " " + c.css('font-family');
	ctx.fillStyle = c.css('color');
	ctx.textAlign = "center";
	ctx.textBaseline = 'middle';
	ctx.fillText(percent + "%", center_w, center_h);
	
	}



function animate(canvas, to, duration){
	c = $(canvas);
	duration = duration ? duration : 600;
	
	var distance = to - c.attr('percent');
	var stepsize = distance / (duration / 50);
	
	// This line prevents an endless loops of no movement due to rounding
	stepsize = stepsize > 0 ? Math.ceil(stepsize) : Math.floor(stepsize);
	
	// stop any still running animation
	var i = c.attr('animInterval');
	
	if(i){
		clearInterval(i);
		}
	
	function step(){
		var pos = parseInt(c.attr('percent'));
		
		if((distance >= 0 && pos + stepsize >= to) || (distance < 0 && pos + stepsize <= to)){
			drawProgress(c, to);
			clearTimeout(c.attr('animInterval'));
			c.attr('animInterval', null);
			
			return
			}
			
		drawProgress(c, pos + stepsize);
		
		i = setTimeout(step, 50);
	
		c.attr('animInterval', i);
		}
		
	step();
	}

