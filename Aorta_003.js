// draw aorta using WebGL
//
// written by Louis Vu on October 1, 2017

function drawAorta(canvas,gl,m4,framebuffer,drawImg,degree){
var vertices = vertCalc(LoadedOBJFiles["Human_heart.obj"].groups['Aorta_Cube.003' ]);
var normalArr = normCalc(LoadedOBJFiles["Human_heart.obj"].groups['Aorta_Cube.003' ]);

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
	shaderProgram.fakecolor_vec = gl.getUniformLocation(shaderProgram,"fakecolor");
	shaderProgram.bool_test = gl.getUniformLocation(shaderProgram,"uOffscreen");

    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vnormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);

    // Data ...
	
    // vertex positions
    var vertexPos = new Float32Array(vertices);

    // vertex normals array
    var vertexNormals = new Float32Array(normalArr);
	
    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = vertices.length/3;

    // create buffer for vertex normals
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    normalBuffer.itemSize = 3;
    normalBuffer.numItems = normalArr.length/3;

    // Scene (re-)draw routine
		//time++;
        // Circle around the y-axis
        // var eye = [5+parseInt(slider1.value),
		// -7+parseInt(slider2.value),
		// parseInt(slider3.value)];
		var eye = [55-parseInt(slider3.value),55-parseInt(slider3.value),0];
        var target = [0,0,0];
        var up = [0,1,0];
        var tCamera = m4.inverse(m4.lookAt(eye,target,up));
        var tProjection = m4.perspective(Math.PI/4,1,1,2000);

        // Move and size aorta
        var tModel2 = m4.multiply(m4.scaling([2,2,2]),
		m4.axisRotation([0, 1, 0], degree*(Math.PI/180)));//Auto Rotate around y axis
        tModel2 = m4.multiply(tModel2, m4.axisRotation([1,0,0], parseInt(slider1.value)*(Math.PI/180)));//Rotate around x axis
		tModel2 = m4.multiply(tModel2, m4.axisRotation([0,0,1], parseInt(slider2.value)*(Math.PI/180)));//Rotate around z axis
		tModel2 = m4.translate(tModel2, [0, 0, 0]);

        var tMVP=m4.multiply(m4.multiply(tModel2,tCamera),tProjection);

        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		gl.uniformMatrix4fv(shaderProgram.view_matrix,false,tCamera);
		gl.uniformMatrix4fv(shaderProgram.proj_matrix,false,tProjection);
		gl.uniformMatrix4fv(shaderProgram.model_matrix,false,tModel2);
		gl.uniform3fv(shaderProgram.lightdir_vec,[-1,1,1]);
		gl.uniform3fv(shaderProgram.cubecolor_vec,[.831,0,0]);
		gl.uniform3fv(shaderProgram.fakecolor_vec,[0,1,1]);

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

		if (drawImg) { 
		//off-screen rendering
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.uniform1i(shaderProgram.bool_test, true);//uOffscreen = uniform boolean in shader
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
		
		//on-screen rendering
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.uniform1i(shaderProgram.bool_test, false);
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
		}

}