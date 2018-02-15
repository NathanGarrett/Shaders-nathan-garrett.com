#version 430
layout (location = 0) in vec3 VertexPosition;
layout (location = 1) in vec3 VertexNormal;
layout (location = 2) in vec2 VertexTexCoord;

out vec3 ReflectDir;

uniform bool DrawSkyBox;
uniform vec3 WorldCameraPosition;
uniform mat3 NormalMatrix;
uniform mat4 ModelViewMatrix;
uniform mat4 ModelMatrix;
uniform mat4 ProjectionMatrix;
uniform mat4 MVP;

void main()
{
	if (DrawSkyBox)
	{
		ReflectDir = VertexPosition;
	}
	else
	{
		//Convert position to world co ordinates
		vec3 WorldPos  = vec3(ModelMatrix * vec4(VertexPosition,1.0));
		//convert normal vector to world co ordinates
		//set value of 4th component to 0 to avoid issues with translation affecting the normal
		vec3 WorldNorm = vec3(ModelMatrix * vec4(VertexNormal,0.0));
		//compute direction to camera
		vec3 WorldView = normalize(WorldCameraPosition - WorldPos);
		//reflect direction vector about the normal
		ReflectDir = reflect(-WorldView,WorldNorm);
	}
	gl_Position = MVP * vec4(VertexPosition,1.0);
}