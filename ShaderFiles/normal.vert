#version 430

layout (location = 0) in vec3 VertexPosition;
layout (location = 1) in vec3 VertexNormal;
layout (location = 2) in vec2 VertexUV;
layout (location = 3) in vec4 VertexTangent;

out Data
{
	vec3 FragPos;
	vec2 TexCoords;
	vec3 TangentLight;
	vec3 TangentView;
	vec3 TangentFragPos;
} data_out;

uniform mat4 Model;
uniform mat4 View;
uniform mat4 Projection;

uniform vec3 lightPos;
uniform vec3 viewPos;

void main()
{
	mat4 MV = Model*View;
	gl_Position = Projection * View * Model * vec4(VertexPosition, 1.0);
	//*********************************************//
	mat3 normalmatrix = transpose(inverse(mat3(Model)));  //Complete this
	vec3 tangent = normalize(mat3(Model) * VertexTangent.xyz);   //Complete this
	vec3 normal = normalize(mat3(Model) * VertexNormal);  //Complete this
	vec3 bitangent = normalize(cross(normal,tangent)*VertexTangent.w);  //Complete this
	mat3 TBN = transpose(mat3(tangent,bitangent,normal));  //Complete this
	//*********************************************//

	data_out.FragPos = vec3(Model * vec4(VertexPosition, 1.0));
	data_out.TexCoords = VertexUV ;  //Complete this
	data_out.TangentLight = TBN * lightPos;  //Complete this 
	data_out.TangentView = TBN * viewPos;   //Complete this 
	data_out.TangentFragPos = TBN * data_out.FragPos ;   //Complete this
}