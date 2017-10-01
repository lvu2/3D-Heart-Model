// draw heart using WebGL
//
// written by Louis Vu on October 1, 2017

function start() { "use strict";
    var slider1 = document.getElementById('slider1');
    slider1.value = 1;
    var slider2 = document.getElementById('slider2');
    slider2.value = 46;
	var slider3 = document.getElementById('slider3');
    slider3.value = 0;
    var canvas = document.getElementById("mycanvas");
	var width = canvas.width;
	var height = canvas.height;
	var gl = canvas.getContext("webgl");
    var m4 = twgl.m4;
	var drawVec = [1,1,1,1];
	var degree = 0;//rotate heart
	var degreeInc = 3;//increment degree by 1 in loop
	//read one pixel
	var readout = new Uint8Array(1*1*4);//readout array is 1*1*4. This means
						//it has one pixel of width times one pixel height times
						//four channels, as the format is RGBA.
	
	/*****Creating a texture to store colors*****/
	var texture = gl.createTexture();//Create a texture object that will contain the image.
	gl.bindTexture(gl.TEXTURE_2D, texture);//Bind the texture the target (TEXTURE_2D) of the active texture unit.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,//Allocating the space to store colors for the offscreen framebuffer
	width, height, 0, gl.RGBA,gl.UNSIGNED_BYTE, null);

	/******Create a Renderbuffer to store depth information******/
	var renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	
	/*****Creating a framebuffer for offscreen rendering*****/
	var framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,//The texture is attached for color
	gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER,//The renderbuffer is attached for depth
	gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

	/****The previously created framebuffer is unbound,
	the WebGL state machine goes back to rendering into the screen framebuffer****/
	gl.bindTexture(gl.TEXTURE_2D, null);//clear?
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);//clear?
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);//clear?

	/******Clicking on the canvas******/
	canvas.addEventListener('mousedown', handleMouseDown, false);
	var x = 0;
	var y = 0;
	function handleMouseDown(event) {
		//var x, y, 
		var top = 0;
		var obj = canvas;
		var left = 0;
		while (obj && obj.tagName !== 'BODY') {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}
		left += window.pageXOffset;//For browser scrolling?
		top -= window.pageYOffset;//For browser scrolling?
		x = event.clientX-left;
		y = canvas.height - (event.clientY-top);
		
		
		/******Reading pixels from the offscreen framebuffer******/
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.readPixels(x,y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,readout);
		gl.bindFramebuffer(gl.FRAMEBUFFER,null);//clear
		if (compare(readout,[1,0,1])) {
			drawVec = [1,0,0,0];
			document.getElementById("heartPart").innerHTML = "Ventricle";
		}
		if (compare(readout,[1,0,0])) {
			alert("red");
		}
		if (compare(readout,[0,1,0])) {
			drawVec = [0,0,0,1];
			document.getElementById("heartPart").innerHTML = "Right Atrium";
		}
		if (compare(readout,[0,0,1])) {
			alert("blue");
		}
		if (compare(readout,[1,1,0])) {
			drawVec = [0,1,0,0];
			document.getElementById("heartPart").innerHTML = "Left Atrium";
		}
		if (compare(readout,[0,1,1])) {
			drawVec = [0,0,1,0];
			document.getElementById("heartPart").innerHTML = "Aorta";
		}
		if (compare(readout,[0,0,0])) {
			drawVec = [1,1,1,1];
			document.getElementById("heartPart").innerHTML = "Heart";
		}
		
	}
	
	/*****Looking for hits******/
	//Readout: read pixel from offscreen buffer
	//Color: object unique color
	function compare(readout, color) {
		return (readout[0]==color[0]*255 && readout[1]==color[1]*255 && readout[2]==color[2]*255);
	}
	
    // Scene (re-)draw routine
    setInterval(function draw() {
		if (document.getElementById("globalBool").value) {//Stop Rotate
			degreeInc = 0;
		}else {
			degreeInc = 3;
		}
		// Clear screen, prepare for rendering
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		drawAuricula(canvas,gl,m4,framebuffer,drawVec[3],degree);//004; Right Atrium
		drawAorta(canvas,gl,m4,framebuffer,drawVec[2],degree);//003; Aorta
		drawAuricula_002(canvas,gl,m4,framebuffer,drawVec[1],degree);//002; Left Atrium
		drawVentriculos(canvas,gl,m4,framebuffer,drawVec[0],degree);//001; Ventricle
		drawVenitas(canvas,gl,m4,degree);//005; Vein
		drawArteritas(canvas,gl,m4,degree);//006; Artery
		degree+=degreeInc;
    },1);

}
