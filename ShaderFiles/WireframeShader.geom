#version 430

layout (triangles) in;
layout (triangle_strip, max_vertices = 3) out;

out vec3 GNormal;
out vec3 GPosition;
out vec3 GlightPos;
noperspective out vec3 GEdgeDistance;

in vec3 N[];
in vec3 vertPos[];
in vec3 lightPos[]; 

uniform mat4 ViewPortMatrix;

void main()
{
	//transform each matrix into vp space
	vec3 p0 = vec3( (gl_in[0].gl_Position / gl_in[0].gl_Position.w));
	vec3 p1 = vec3( (gl_in[1].gl_Position / gl_in[1].gl_Position.w));
	vec3 p2 = vec3( (gl_in[2].gl_Position / gl_in[2].gl_Position.w));
	//find ha, hb and hc
	float a = length(p1-p2);
	float b = length(p2-p0);
	float c = length(p1-p0);
	float alpha = acos((b*b + c*c - a*a) / (2.0*b*c));
	float beta  = acos((a*a + c*c - b*b) / (2.0*a*c));
	float ha = abs(c * sin(beta));
	float hb = abs(c * sin(alpha));
	float hc = abs(b * sin(alpha));
	
	//Send triangle to fragment along with edge distances
	GEdgeDistance = vec3(ha,0,0);
	GNormal   = N[0];
	GPosition = vertPos[0];
	GlightPos = lightPos[0];
	gl_Position = gl_in[0].gl_Position;
	EmitVertex(); 

	GEdgeDistance = vec3(0,hb,0);
	GNormal   = N[1];
	GPosition = vertPos[1];
	GlightPos = lightPos[1];
	gl_Position = gl_in[1].gl_Position;
	EmitVertex(); 

	GEdgeDistance = vec3(0,0,hc);
	GNormal   = N[2];
	GPosition = vertPos[2];
	GlightPos = lightPos[2];
	gl_Position = gl_in[2].gl_Position;
	EmitVertex(); 

	EndPrimitive();

}