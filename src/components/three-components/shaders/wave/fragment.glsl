uniform sampler2D uTexture;

varying vec2 vUv;

#include "../noise2D.glsl"
#include "../voronoi2D.glsl"

void main() {
    vec3 color = texture2D(uTexture, vUv).rgb;

    // vec3 color = vec3(noise(vUv * 10.0));
    gl_FragColor = vec4(color, 1.0);
}