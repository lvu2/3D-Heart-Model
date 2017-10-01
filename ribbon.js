// draw a textured cube using WebGL
//
// written by Louis Vu on October 30, 2016

function start() { "use strict";
    var slider1 = document.getElementById('slider1');
    slider1.value = 0.0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
	var slider3 = document.getElementById('slider3');
    slider3.value = 0;
    var canvas = document.getElementById("mycanvas");
	var gl = canvas.getContext("webgl");
    var m4 = twgl.m4;

	//time++;
    // Get canvas, WebGL context, twgl.m4

	
    // Scene (re-)draw routine
    setInterval(function draw() {
		//drawVenitas(canvas,gl,m4);
		var vertices = vertCalc(LoadedOBJFiles["Human_heart.obj"].groups['Venitas_Cube.006' ]);
var normalArr = normCalc(LoadedOBJFiles["Human_heart.obj"].groups['Venitas_Cube.006' ]);

//var time = 0;
//var move = 0;
   // Sliders at center

 

    // Read shader source
    var vertexSource = document.getElementById("vs").text;
    var fragmentSource = document.getElementById("fs").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader)); return null; }

    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader)); return null; }

    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);

    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vpos");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);

    //shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    //gl.enableVertexAttribArray(shaderProgram.ColorAttribute);

    // this gives us access to the matrix uniform
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");
	shaderProgram.view_matrix = gl.getUniformLocation(shaderProgram,"view");
	shaderProgram.proj_matrix = gl.getUniformLocation(shaderProgram,"proj");
	shaderProgram.model_matrix = gl.getUniformLocation(shaderProgram,"model");
	shaderProgram.lightdir_vec = gl.getUniformLocation(shaderProgram,"lightdir");
	shaderProgram.cubecolor_vec = gl.getUniformLocation(shaderProgram,"cubecolor");

    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vnormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);

    // Data ...
	
    // vertex positions
    var vertexPos = new Float32Array(vertices);

    // vertex colors
    var vertexColors = new Float32Array(
        [128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
           // 10, 0, 0,   10, 0, 0,   10, 0, 0,   10, 0, 0,
           // 0, 10, 0,   0, 10, 0,   0, 10, 0,  /*0, 1, 0,
			]);

    // vertex normals array
    var vertexNormals = new Float32Array(normalArr);
	
    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = vertices.length/3;

    // a buffer for colors
    // var colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    // colorBuffer.itemSize = 3;
    // colorBuffer.numItems = vertices.length/3;

    // create buffer for vertex normals
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    normalBuffer.itemSize = 3;
    normalBuffer.numItems = normalArr.length/3;

    // Scene (re-)draw routine
		//time++;
        // Circle around the y-axis
        var eye = [5+parseInt(slider1.value),
		-7+parseInt(slider2.value),
		parseInt(slider3.value)];
        var target = [0,0,0];
        var up = [0,1,0];
        var tCamera = m4.inverse(m4.lookAt(eye,target,up));
        var tProjection = m4.perspective(Math.PI/4,1,1,2000);


        // draw body
        var tModel2 = m4.multiply(m4.scaling([2, 2, 2]), m4.axisRotation([1, 0, 0], 0));//Math.sin(-Math.PI/4)));
        tModel2 = m4.translate(tModel2, [0, 0, 0]);


        var tMVP=m4.multiply(m4.multiply(tModel2,tCamera),tProjection);

        // Clear screen, prepare for rendering
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		gl.uniformMatrix4fv(shaderProgram.view_matrix,false,tCamera);
		gl.uniformMatrix4fv(shaderProgram.proj_matrix,false,tProjection);
		gl.uniformMatrix4fv(shaderProgram.model_matrix,false,tModel2);
		gl.uniform3fv(shaderProgram.lightdir_vec,[-1,1,1]);
		gl.uniform3fv(shaderProgram.cubecolor_vec,[1,0,0]);

        // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
            // gl.FLOAT,false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
            gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, normalBuffer.itemSize,
            gl.FLOAT, false, 0, 0);

        var normalMatrix = m4.multiply(tModel2,tCamera);
        normalMatrix = m4.transpose(m4.inverse(normalMatrix));
        shaderProgram.nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
        gl.uniformMatrix4fv(shaderProgram.nUniform, false, normalMatrix);

        // Do the drawing
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	    // Read shader source
    var vertexSource = document.getElementById("vs2").text;
    var fragmentSource = document.getElementById("fs2").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader)); return null; }

    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader)); return null; }

    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);

    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vpos");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);

    //shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    //gl.enableVertexAttribArray(shaderProgram.ColorAttribute);

    // this gives us access to the matrix uniform
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");
	shaderProgram.view_matrix = gl.getUniformLocation(shaderProgram,"view");
	shaderProgram.proj_matrix = gl.getUniformLocation(shaderProgram,"proj");
	shaderProgram.model_matrix = gl.getUniformLocation(shaderProgram,"model");
	shaderProgram.lightdir_vec = gl.getUniformLocation(shaderProgram,"lightdir");
	shaderProgram.cubecolor_vec = gl.getUniformLocation(shaderProgram,"cubecolor");

    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vnormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);	
		
		
		
		//drawArteritas(canvas,gl,m4);
		var vertices = vertCalc(LoadedOBJFiles["Human_heart.obj"].groups['Arteritas_Cube.005' ]);
	var normalArr = normCalc(LoadedOBJFiles["Human_heart.obj"].groups['Arteritas_Cube.005' ]);

    // Data ...
	
    // vertex positions
    var vertexPos = new Float32Array(vertices);

    // vertex colors
    var vertexColors = new Float32Array(
        [128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
		128, 0, 128,   128, 0, 128,   128, 0, 128,   128, 0, 128,
           // 10, 0, 0,   10, 0, 0,   10, 0, 0,   10, 0, 0,
           // 0, 10, 0,   0, 10, 0,   0, 10, 0,  /*0, 1, 0,
			]);

    // vertex normals array
    var vertexNormals = new Float32Array(normalArr);
	
    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer_2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer_2.itemSize = 3;
    trianglePosBuffer_2.numItems = vertices.length/3;

    // a buffer for colors
    // var colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    // colorBuffer.itemSize = 3;
    // colorBuffer.numItems = vertices.length/3;

    // create buffer for vertex normals
    var normalBuffer_2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer_2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    normalBuffer_2.itemSize = 3;
    normalBuffer_2.numItems = normalArr.length/3;

    // Scene (re-)draw routine
		//time++;
        // Circle around the y-axis
        var eye = [5+parseInt(slider1.value),
		-7+parseInt(slider2.value),
		parseInt(slider3.value)];
        var target = [0,0,0];
        var up = [0,1,0];
        var tCamera = m4.inverse(m4.lookAt(eye,target,up));
        var tProjection = m4.perspective(Math.PI/4,1,1,2000);


        // draw body
        var tModel2 = m4.multiply(m4.scaling([2, 2, 2]), m4.axisRotation([1, 0, 0], 0));//Math.sin(-Math.PI/4)));
        tModel2 = m4.translate(tModel2, [0, 0, 0]);


        var tMVP=m4.multiply(m4.multiply(tModel2,tCamera),tProjection);

        // Clear screen, prepare for rendering
        //gl.clearColor(0.0, 0.0, 0.0, 1.0);
        //gl.enable(gl.DEPTH_TEST);
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		gl.uniformMatrix4fv(shaderProgram.view_matrix,false,tCamera);
		gl.uniformMatrix4fv(shaderProgram.proj_matrix,false,tProjection);
		gl.uniformMatrix4fv(shaderProgram.model_matrix,false,tModel2);
		gl.uniform3fv(shaderProgram.lightdir_vec,[-1,1,1]);
		gl.uniform3fv(shaderProgram.cubecolor_vec,[0,0,1]);

        // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
            // gl.FLOAT,false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_2);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer_2.itemSize,
            gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer_2);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, normalBuffer_2.itemSize,
            gl.FLOAT, false, 0, 0);

        var normalMatrix = m4.multiply(tModel2,tCamera);
        normalMatrix = m4.transpose(m4.inverse(normalMatrix));
        shaderProgram.nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
        gl.uniformMatrix4fv(shaderProgram.nUniform, false, normalMatrix);

        // Do the drawing
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
		
		
		
		
		
		
		
		
		
    },10);

    //slider1.addEventListener("input",draw);
    //slider2.addEventListener("input",draw);
    //draw();
}
