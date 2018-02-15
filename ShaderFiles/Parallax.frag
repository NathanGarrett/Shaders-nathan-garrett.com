#version 430

out vec4 FragColour;

in Data
{
	vec3 FragPos;
	vec2 TexCoords;
	vec3 TangentLight;
	vec3 TangentView;
	vec3 TangentFragPos;
} data_in;

uniform sampler2D diffusemap;
uniform sampler2D normalmap;
uniform sampler2D specularmap;
uniform sampler2D heightmap;

uniform float heightscale;

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir);

void main()
{
	vec3 viewDir   = normalize(data_in.TangentView - data_in.FragPos);   //Complete this
	vec2 texCoords = ParallaxMapping(data_in.TexCoords,viewDir); 	
	if(texCoords.x > 1.0 || texCoords.y > 1.0 || texCoords.x < 0.0 || texCoords.y < 0.0)
    discard;
	vec3 normal = texture(normalmap, data_in.TexCoords).rgb;
	normal = normalize(normal * 2.0 - 1.0);


	vec3 color = texture(diffusemap, texCoords).rgb;

	vec3 ambient = 0.1 * 0.2 * color;
	
	vec3 lightDir = normalize(data_in.TangentLight - data_in.FragPos ) ;  //Complete this

	float diff = max(dot(lightDir, normal), 0.0);
	vec3 diffuse = diff * color;


	vec3 reflectDir = reflect(-lightDir, normal);
	vec3 halfway = normalize(lightDir + viewDir);

	float spec = pow(max(dot(normal, halfway), 0.0), 32.0);
	vec3 specular = vec3(0.2) * spec;
	vec3 Spec = texture(specularmap, texCoords).rgb;
	FragColour = vec4(ambient + diffuse + (specular * Spec.x), 1.0f);
}

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
{
	//number of depth layers
	const float minLayers = 8.0;
	const float maxLayers = 32.0;
	float numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0.0, 0.0, 1.0), viewDir))); 
	//calculate the size of each layer
	float layerDepth = 1.0 / numLayers;
	//depth of this layer
	float currentLayerDepth = 0.0;
	//amount to shift the texture coordinates per layer (from vector P)
	vec2 P = viewDir.xy * heightscale;
	vec2 deltaTexCoords = P / numLayers;
	
	// get initial values
	vec2  currentTexCoords     = texCoords;
	float currentDepthMapValue = texture(heightmap, currentTexCoords).r;
  
	while(currentLayerDepth < currentDepthMapValue)
	{
		// shift texture coordinates along direction of P
		currentTexCoords -= deltaTexCoords;
		// get depthmap value at current texture coordinates
		currentDepthMapValue = texture(heightmap, currentTexCoords).r;  
		// get depth of next layer
		currentLayerDepth += layerDepth;  
	}

	// get texture coordinates before collision (reverse operations)
	vec2 prevTexCoords = currentTexCoords + deltaTexCoords;

	// get depth after and before collision for linear interpolation
	float afterDepth  = currentDepthMapValue - currentLayerDepth;
	float beforeDepth = texture(heightmap, prevTexCoords).r - currentLayerDepth + layerDepth;
 
	// interpolation of texture coordinates
	float weight = afterDepth / (afterDepth - beforeDepth);
	vec2 finalTexCoords = prevTexCoords * weight + currentTexCoords * (1.0 - weight);

	return finalTexCoords; 
}