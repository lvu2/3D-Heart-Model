# 3D-Heart-Model

Rendered a 3D heart model by using WebGL and TWGL library.

## Sections

**Object Load** - The heart consisted of 6 parts (artery, vein, left atrium, right atrium, ventricle, and aorta).

**Lighting** - Implemented Phong light(specualr, diffuse, and ambient) to enhance realism.  Artery and vein are transparent.

**Picking** - Picking object based on object colors to isolate a specific part of the heart.

## Object Load

Used a loader authored by a fellow UW alum, Yusef Sohail, that will convert Obj files into JavaScript code that includes vertex, normal and triangle index data.  Here is the link to the generator: http://graphics.cs.wisc.edu/Courses/559-f2015/Examples/OBJGenerator/generator.html

## Lighting

Implementd Phong reflection which is the reflection of light as the sume of three types of reflection: ambient, diffuse, and specular.  Abient is the scattered light present in the scene.  Diffuse lighting is scattered reflections in many directions.  Specular gives the object a mirror-like reflections.

## Picking

Every object is assigned a different color in the scene and rendered to an offscreen framebuffer.  When a user clicks on the scene, the offscreen framebuffer returns a color that corresponds to the coordinates of the click.
