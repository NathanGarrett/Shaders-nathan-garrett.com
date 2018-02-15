#version 430

layout (location = 0) in vec3 VertexPosition;
layout (location = 1) in vec3 VertexNormal;
 
out vec3 N;
out vec3 vertPos;
out vec3 lightPos; //Light position in eye coords

uniform vec3 LightPosition; // Light position 
uniform mat4 Model;
uniform mat4 View;
uniform mat4 Projection;
uniform mat4 MVP;
uniform mat3 NormalMatrix;

void main()
{
	
	N   = normalize(NormalMatrix * VertexNormal);
	vertPos = vec3(View * Model * vec4(VertexPosition,1.0));
	lightPos = vec3(View * Model * vec4(LightPosition,1.0));  

	gl_Position = MVP * vec4(VertexPosition,1.0); 
}