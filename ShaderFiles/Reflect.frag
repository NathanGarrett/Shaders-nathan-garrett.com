#version 430

in vec3 ReflectDir;

layout (binding=0) uniform samplerCube CubeMapTex;

uniform bool  DrawSkyBox;
uniform float ReflectFactor = 1;
uniform vec4 MaterialColor;

layout (location = 0) out vec4 FragColor;

void main() 
{
	vec4 CubeMapColor = texture(CubeMapTex,ReflectDir);
	if(DrawSkyBox)
	{
		FragColor = CubeMapColor;
	}
	else
	{
		FragColor = mix(MaterialColor,CubeMapColor,ReflectFactor);
	}
}
