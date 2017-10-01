
/**
 * Created by lvu on 12/9/2016.
 */
function vertCalc(group) {
    //var car2 = LoadedOBJFiles["Lamborghini.obj"];
//vertexes/////////////////////////////////////////////////
    var data = [];//[geometries.vertices.length*3];
    for(var i = 0; i < group.vertices.length; i++){
        for(var j = 0; j < 3; j++) {
            data[(i*3) + j] = group.vertices[i][j];
        }
    }

    //get indices for vertices
    var data3 = [];
    var k = 0;
    for(var i = 0; i < group.faces.length; i++){
        var tmp = group.faces[i];
        for(var j = 0; j < 3; j++) {
            var tmp2 = tmp[j];
            data3[k] = tmp2[0];
            k++;
        }
    }

//correct order for vertices
    var vec4 = [];
    var o = 0;
    for(var m = 0; m < data3.length; m++) {
        //vec4[m] = data[data3[m]];
        //console.log(3*(data3[m]));
        for(var n = 0; n < 3; n++) {
            //vec4[o] = data[data3[n]];
            var indexVal = 3*(data3[m]);
            vec4[o] = data[indexVal + n];
            o++;
        }
    }
    return vec4;
};

function normCalc (group) {
//normal////////////////////////////////////////
//             var car2 = LoadedOBJFiles["Lamborghini.obj"];
 //normal////////////////////////////////////////
        var data2 = [];//[geometries.vertices.length*3];
        for(var i = 0; i < group.normals.length; i++){
            for(var j = 0; j < 3; j++) {
                data2[(i*3) + j] = group.normals[i][j];
            }
        }
    //get indices for normal
        var data5 = [];
        var k = 0;
        for(var i = 0; i < group.faces.length; i++){
            var tmp = group.faces[i];
            for(var j = 0; j < 3; j++) {
                var tmp2 = tmp[j];
                data5[k] = tmp2[2];
                k++;
            }
        }
    //correct order for normal
    var vec5 = [];
    var p = 0;
    for(var m = 0; m < data5.length; m++) {
        for(var n = 0; n < 3; n++) {
            var indexVal = 3*(data5[m]);
            vec5[p] = data2[indexVal + n];
            p++;
        }
    }
    return vec5;
};

function textCoordCalc (group) {
    //vt////////////////////////////////////////
        var data10 = [];//[geometries.vertices.length*3];
        for(var i = 0; i < group.texCoords.length; i++){
            for(var j = 0; j < 2; j++) {
                data10[(i*2) + j] = group.texCoords[i][j];
            }
        }
    //get indices for vt
        var data11 = [];
        var k = 0;
        for(var i = 0; i < group.faces.length; i++){
            var tmp = group.faces[i];
            for(var j = 0; j < 3; j++) {
                var tmp2 = tmp[j];
                data11[k] = tmp2[1];
                k++;
            }
        }
    //correct order for vt
    var vec12 = [];
    var p = 0;
    for(var m = 0; m < data11.length; m++) {
        for(var n = 0; n < 2; n++) {
            var indexVal = 2*(data11[m]);
            vec12[p] = data10[indexVal + n];
            p++;
        }
    }
    return vec12;
}
