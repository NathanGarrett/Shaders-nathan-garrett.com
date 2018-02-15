#version 430

//Ambient light Components
uniform vec3 Ka;
uniform vec3 La;         
//Diffuse light components
uniform vec3 Kd;            
uniform vec3 Ld;    
//Specular light components
uniform vec3 Ks;
uniform vec3 Ls;
//Line info struct
uniform struct LineInfo
{
	float Width;
	vec4  Color;
} Line;

in vec3 GNormal;
in vec3 GPosition;
in vec3 GlightPos;
noperspective in vec3 GEdgeDistance;

layout (location = 0) out vec4 FragColour;

vec4 PhongModel(vec3 vertPos, vec3 N)
{
	
	vec4 Ia = vec4(La,1.0) * vec4(Ka,1.0); 
    vec3 L = normalize(GlightPos - vertPos); 
	float theta = dot(N,L);
	//theta = ceil(theta * QuantLevels)/QuantLevels;
    vec4 Id = vec4(Ld,1.0) * max(theta, 0.0); 
    Id = clamp(Id , 0.0, 1.0); 
    Id =  vec4(Kd,1.0) * Id; 
    vec3 Dist = GlightPos - vertPos; 
	//calculate attenuation distance and divide by arbitrary number
	 float d = sqrt((Dist.x * Dist.x) + (Dist.y * Dist.y) + (Dist.z * Dist.z));
	d = d/25; 
	float Fatt = 1/(d*d);
	Fatt = clamp(Fatt,0.0,1.0);
	float n = 2;
	vec4 R = vec4(normalize(reflect(L,normalize(N))),1.0);
	vec4 V = vec4(normalize(vertPos),1.0);
	vec4 Is = vec4(Ls,1.0) * vec4(Ks,1.0) * pow(max(dot(R,V),0.0),n); //angle between lookat and reflected ray
	return Ia + (Fatt * Id) + (Fatt * Is);
}

void main() 
{
	//shaded surface colour
	vec4 color = vec4(PhongModel(GPosition,GNormal));
	//find min distance
	float d = min(GEdgeDistance.x,GEdgeDistance.y);
	d = min(d,GEdgeDistance.z);
	//Find the mix factor with the line colour
	float mixVal = smoothstep(Line.Width - 0.01, Line.Width +0.01, d);
	//mix surafce colour with line colour
	FragColour = mix(Line.Color,color,mixVal);
}