#version 430
layout (location = 0) in vec3 VertexPosition;
layout (location = 1) in vec3 VertexNormal;

out vec3 ReflectDir; //Reflected direction
out vec3 RefractDir; //Transmitted direction

struct MaterialInfo 
{
	float Eta;				//Ratio of indices of refraction
	float ReflectionFactor;	//Percentage of reflected light
};

uniform MaterialInfo Material;
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
		vec3 WorldPos  = vec3(ModelMatrix * vec4(VertexPosition,1.0));
		vec3 WorldNorm = vec3(ModelMatrix * vec4(VertexNormal,0.0));
		vec3 WorldView = normalize(WorldCameraPosition - WorldPos);

		ReflectDir = reflect(-WorldView,WorldNorm);
		RefractDir = refract(-WorldView,WorldNorm,Material.Eta);
	}
	gl_Position = MVP * vec4(VertexPosition,1.0);
}