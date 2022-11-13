# 18. Particle

파티클은 정확히 이름 그대로를 의미하며 하늘에 떠있는 별, 연기, 비, 먼지와 같이 특수한 효과를 묘사하데 사용될 수 있습니다. 파티클의 장점은 적당한 frame rate를 가지고 한 장면에서 100,000개를 보여줄 수 있습니다. 단점은 각 particle들이 **카메라 방향으로 보이는 평면(즉, 두 개의 triangle - face)으로 구성되야한다**는 점입니다.

> https://threejs-journey.com/lessons/geometries#what-is-a-geometry

> In Three.js, geometries are composed of vertices (point coordinates in 3D spaces) and faces (triangles that join those vertices to create a surface).

> We use geometries to create meshes, but you can also use geometries to form particles. Each vertex (singular of vertices) will correspond to a particle, but this is for a future lesson.
> 위 09. Geometries 에서 언급되었던 적이 있습니다.

하나의 particle은 4개의 vertex로 이뤄진 평면이라고 생각하고 그 사각 평면에 어떤 사이즈/효과를 주냐에 따라 다양항 효과를 묘사할수 있을 것 같다는 추측이듭니다.

## Particle 만들기

Particle은 [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) 만드는 것 만큼 쉽게 만들수 있습니다.

우리는 이전에 한번 사용했던 [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) 클래스와 각 파티클의 matrial을 묘사하기위해 [PointsMaterial](https://threejs.org/docs/#api/en/materials/PointsMaterial)를 사용할 예정입니다.

(Points 자체를 쓰기보다는) => 왜? 영상 강의에서 찾아보기. 학습을 위해서일듯

## 실습 환경 만들기

### Geometry - 우선, 파티클의 위치 정하기.

우선, 저희는 파티클을 만들기 위해서 기본적인 Three.js Geometry들을 사용할 수 있습니다. 그리고 사용한 geometry들의 각 vertex들이 particle이 될 수 있습니다.

```typescript
new THREE.SphereGeometry(1, 32, 32);
```

이렇게 만든 구 형태의 geometry의 각 vertex를 이용하며 원형태의 파티클을 만들 수 있습니다.

### PointsMaterial - 파티클들의 색, 효과, 크기 만들기

파티클 효과를 위해서 PointMaterial이라는 특별한 Material이 필요합니다.

Material 챕터에서는 나중에 보기로하고 넘어갔었습니다.

> https://threejs-journey.com/lessons/materials#pointsmaterial

여기서 소개하는 PointsMaterial을 통해 이미 많은 것을 표현할 수 있지만 추후에 우리만의 particle material을 만드는 방법을 살펴볼 것 같습니다. => 어떤 한계가 있을까요?

### PointsMaterial 의 다양한 properties

- `size` 와 `sizeAttenuation`

각 particle 크기를 제어할 수 있는 `size` 와 멀리있는 파티클들이 가까지 있는 파티클보다 작아야할지를 나타내는 flag 값인 `sizeAttenuation`.

> sizeAttenuation: Specify whether points' size is attenuated by the camera depth. (Perspective camera only.) Default is true.

```typescript
// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
});
```

기존 도형에 particle들을 나타내는 건 엄청 간단하지만 특별한 효과를 내기에는 한계가 있을 것 같네요. geometry를 커스텀하게 만들어보죠.

머리 아플 수 있는데 더 재밌는 부분

### Custom Geometry

Custom Geomtry를 만들기 위해서, `Material` 챕터에서 잠시 사용해봤던 BufferGeomtry를 이용할 수 있습니다.

BufferGeomtry에 `poistion` attribute 을 추가해서 Sphere Geometry 를 대체해보죠.

```typescript
const particlesGeometry = new THREE.BufferGeometry();
const count = 500;

const positions = new Float32Array(count * 3); // 500개의 꼭지점

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10; // 최대 5, 최소 -5
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
```

BufferGeometry의 사용법을 다시 되새겨보죠. geometry의 각 vertex를 programatic한 방법으로 일일히 지정하는 방식입니다. 즉, 각 꼭지점의 위치 값을 저희가 정의할 수 있는 것이죠. 다만, GPU에서 쉽게 받아서 처리할 수 있는 타입이 정해진 숫자타입 TypedArray 인 Float32Array를 사용해서 Geometry의 속성을 바꿔야하죠.

코드가 조금 복잡해 보이지만 간결한 편인 것 같습니다. 그리고 이번 챕터가 재밌는 점은 저희 컴퓨터의 한계를 실험해볼 수 있는 기회입니다.

최대 몇개의 파티클을 한 화면에서 나타낼 수 있을까요? 위 예제는 500개의 vertex를 나타냈습니다. 아마 컴퓨터는 100,000 개 정도가 적당하겠지만 스마트 폰은 확실히 다르다는것을 알 거에요. frame rate를 확인해보면 알 수 있습니다.

### Frame rate 확인방법

```typescript
import Stats from "three/examples/jsm/libs/stats.module";

// ...

const stats = new Stats();
document.body.appendChild(stats.dom);

const tick = () => {
  // ...
  // Render
  renderer.render(scene, camera);

  // TODO: Add this
  stats.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
```

제 PC에서 테스트 했을 때는 아래와 같은 FPS 변화를 확인할 수 있었습니다.

| # of Particle | FPS |
| ------------- | --- |
| 1,000,000     | 60  |
| 2,000,000     | 60  |
| 3,000,000     | 51  |
| 4,000,000     | 45  |
| 5,000,000     | 30  |

모바일에서의 성능은.. 다음 기회에

### Color, map and alpha map

> 학습 중 궁금한점 particle은 shadow를 가질 수 있을까? 일종의 평면이니 가능하지않을까?

- `PointsMaterial.color`

Particle의 색 변경 가능

- `PointsMaterial.map`

```typescript
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

// ...

particlesMaterial.map = particleTexture;
```

Texture 사용법은 다른 Material과 동일한 방식으로 적용가능합니다. 특별한 점은 없네요.

예제에 사용한 particle textures들은 [Kenney 사이트에서 만들어진 texture](https://www.kenney.nl/assets/particle-pack)들의 resizing 버젼들입니다.

물론 우리만의 것을 만들 수도 있겠죠? 이전에 사용한 door texture도 가능...

- `PointsMaterial.alphaMap`

이 속성도 복습입니다. 위에서 `map`으로 texture를 적용한 파티클들은 뒤의 파티클을 가려서 자연스럽지않은데 이전에 사용했던 `alphaMap`에 이전 파티클을 적용하면 더욱 자연스러워집니다.

나아지긴했는데 여전히 문제가 있습니다. 자세히 들여다보면 **실제 파티클 위치 순서와 상관없이 무작위로 앞뒤에 나타남**을 확인할 수 있습니다.
이 문제는 파티클들은 생성되는 순서로 그려지기 때문입니다. (우리가 랜덤하게 파티클들의 위치를 만들기 때문에)

"뒤에 있는 애들이 앞에 있다고 판단되는 듯하다."

이 문제를 고치는 방법은 다양합니다.

### Particle들 간의 위치 문제 - 생성 순서가 위치가 되어버려서 문제

#### 1. PointsMaterial.alphaTest 사용하는 방법

`alphaTest`는 0 ~ 1 사이의 값입니다.WebGL이 pixel의 투명도(transparency)에 따라 pixel을 렌더링할지말지를 판단할 수 있도록하는 값입니다.

조금 이해가 안될 수 있지만 alpha 값이 alphaTest보다 작은 경우 해당 pixel은 렌더링 하지마라! 라는 의미로 저는 이해하니 편했습니다.

alpha값이 너무 낮은 pixcel 값들은 아예 랜더링하지않는 방법이죠. (직접 확인해보면 이해가 쉽습니다.)

하지만 원의 태두리를 자세히 보시면 여전히 보이는 파티클과 안보이는 파티클이 랜덤합니다.

#### 2. PointsMaterial.depthTest 사용하는 방법

```typescript
particleMaterials.depthTest = false;
```

파티클들을 그릴 때 WebGL은 그려질 파티클이 이미 그려진 것보다 가까이 있는지를 검사하는 테스트를 진행합니다. 이 과정을 `depth test` 라고 말합니다.그리고 이 기능을 비활성화 시킬 수 있습니다.

해당 material를 그릴때 앞 뒤 여부계산을 하지않고 진행을 한다고 생각할 수 있습니다.

이 해결책이 파티클만 있을 때의 문제를 해결하는 것 같지만 다른 object가 앞에 있을 때 파티클이 무조건 앞에 있다고 판단하는 심각한 버그가 발생합니다.

#### 3. PointsMaterial.depthWrite

```typescript
particleMaterials.depthWrite = false;
```

말했던 것처럼,WebGL은 앞으로 그릴 것이 이미 그려진 것보다 가까이 있는지 검사를 합니다.

앞으로 그려질 것의 depth는 `depth buffer` 라는 곳에 저장이 됩니다.

`depth buffer` 속에 있는 것보다 가까이 파티클이 가까이 있는지 검사를 아예 안하는 것 대신에, 우리는 Web GL에게 depth buffer에 있는 것을 그리지말라고 이야기할 수 있습니다. (파티클들을 그릴 때만 depth Test를 안하는 방법)

이 방법이 결함이 거의 없는 것 처럼 보일 수 있지만 아마 파티클 간의 opacity가 필요한 경우, 문제가 있을 것 같네요.

파티클을 그릴 때 파티클의 위치 순서가 없음으로 인한 이상현상을 살펴봤습니다. 그리고 몇가지 해결책을 살펴봤는데 완벽한 해결책은 없으니 프로젝트에 맞는 방법을 찾아야할 것 같습니다.

### Blending

`PointsMaterial.blending` property 는 WebGL에게 pixel을 그릴 뿐만아니라, 이미 그려진 pixel의 color에 그릴 pixel의 color를 더하라는 의미입니다.

이 property를 이용하면 `saturation effect` (침투 효과)를 나타낼 수 있습니다. 여러개가 겹쳐있다는 효과

### Different Colors

각 particle 별로 다른 색깔을 나타낼 수도 있습니다.

```typescript
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

//...

particlesMaterial.vertexColors = true;
```

## Animation

Wave 예시는 생략하고 2d coordinate를 이용한 sin 함수
