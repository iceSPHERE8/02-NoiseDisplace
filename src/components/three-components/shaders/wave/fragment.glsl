uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uScale;
uniform float uStrength;
uniform float uOffset;
uniform float uNoise;

varying vec2 vUv;

#include "../noise2D.glsl"
#include "../voronoi2D.glsl"

void main() {
    vec2 voroiPara = vec2((cnoise(vec2(vUv.x * uScale.x * 0.5, vUv.y * uScale.y * 0.5)) + uTime * 0.1 + uOffset), cnoise(vUv));
    vec2 displace = cellular(voroiPara * uNoise);

    displace.x = smoothstep(0.2, 0.8, displace.x);
    displace.y = smoothstep(0.2, 0.8, displace.y);
    vec2 newUv = vec2(vUv.x, vUv.y + displace.y * uStrength);

    newUv = mix(vUv, newUv, displace.x);

    // Create the edge gradient 
    vec2 border = vUv;
    border.x = clamp(pow(vUv.x, 10.0) + 0.2, 0.0, 1.0);
    border.y = clamp(pow(vUv.y, 10.0) + 0.2, 0.0, 1.0);

    float newBorderX = clamp(pow(1.0 - vUv.x, 10.0) + 0.2, 0.0, 1.0);
    float newBorderY = clamp(pow(1.0 - vUv.y, 10.0) + 0.2, 0.0, 1.0);

    float edge = border.x + border.y + newBorderX + newBorderY;
    edge = smoothstep(0.8, 2.0, edge);
    
    newUv = mix(newUv, vUv, edge);

    vec3 color = texture2D(uTexture, newUv).rgb;

    gl_FragColor = vec4(color, 1.0);
}