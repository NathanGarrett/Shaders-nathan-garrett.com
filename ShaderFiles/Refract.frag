#version 430

in vec3 ReflectDir;
in vec3 RefractDir;

layout (binding=0) uniform samplerCube CubeMapTex;

uniform bool  DrawSkyBox;
struct MaterialInfo 
{
	float Eta;
	float ReflectionFactor;
};

uniform MaterialInfo Material;

layout (location = 0) out vec4 FragColor;

void main() 
{
	vec4 RefractColor = texture(CubeMapTex,RefractDir);
	vec4 ReflectColor = texture(CubeMapTex,ReflectDir);
	if(DrawSkyBox)
	{
		FragColor = ReflectColor;
	}
	else
	{
		FragColor = mix(RefractColor,ReflectColor,Material.ReflectionFactor);
	}
}
