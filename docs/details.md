This is a sophisticated project requiring a merge of architectural aesthetic, advanced front-end animation, and structured AI workflow. Relying on agentic tools is a strong choice, but those agents require highly specific, architectural instructions to succeed.

Here is a curated, detailed plan for the website, followed by a specific guide and prompt for processing your architectural renders using AI.

Part 1: Strategic Website Architecture & Animation Plan
This plan is optimized for execution via agentic tools, focusing on specific library integration and data structure over general template usage.

1. Technical Stack & Architecture
To achieve high-performance 3D and 2D physics integration, you need a robust framework.

Frontend Framework: Next.js (React) is standard for this. It handles static generation (SSG) for fast portfolio loading and server-side rendering (SSR) for initial render speed.

Agentic Interaction: Structure your project by defining specialized "Agent Roles" that your tools will assume.

Architecture Design Agent: Dictates minimalist grid layouts, dark mode aesthetics, and futuristic color palettes (e.g., charcoal, white, neon cyan accent). It ensures typography standards are met.

Code Implementation Agent: Implements the physics engines and animation libraries (GSAP, Three.js) with precision.

Content & Image Agent: Manages the asset processing pipeline (described in Part 2).

2. Advanced Animation Strategy & Library Research
This is the core of the request. Do not try to use "built-in" animations; instead, implement these specific physics-driven components.

Library	Primary Use Case	Suggested GitHub Repos/Keywords for Research	Implementation Example
GSAP (GreenSock)	Core Tweening, Scrolling, Transitions.	gsap-scrolltrigger-examples, gsap-flip-plugin, gsap-magnetic-button	ScrollTrigger: Essential. Every project element should animate fluidly on scroll. Use GSAP Flip for the deep-dive image transitions, making images "grow" seamlessly from a small grid thumbnail to a full-screen gallery view.
Three.js	3D WebGL Interaction.	react-three-fiber, drei, threejs-particle-effects	HomePage Hero: Don't just show a photo. Animate a Three.js cloud of particles that subtly form into abstract architectural geometries that references the studio's USA or Hyderabad projects (e.g., an abstract wireframe of the City Gateway).
Matter.js	2D Physics Engine.	matter-js-examples, magnet-cursor-matterjs	Portfolio Grid: Instead of a static grid, make the thumbnails subtly "magnetic." When the cursor hovers near them, they are softly attracted to it (using physics forces). When clicked, a "repulsion" force is applied briefly before the image opens. This provides the aesthetic, non-random physics feel.
P5.js	Generative Design (Particle Systems).	p5js-generative-art, p5js-flow-fields	"Popping" Interaction: Instead of intrusive pop-ups, use P5.js to generate subtle, context-aware 2D particle "dust" or glowing lines that float gently near specific project details (like a structural joint on a render) and interact with the user's cursor.
3. UX and Structure: The Home Page Hero
The homepage is your "catching point." Integrate the two office locations and the advanced physics requirements here.

Approach A (Interactive 3D): A Three.js 3D globe showing the US and Hyderabad. When highlighted, an animated, schematic line drawing of the Cape Fear Botanical Garden or the 214 Burgess Street theatre (an open-air auditorium) is dynamically drawn on screen using GSAP DrawSVG.

Approach B (Minimalist Flow): A vast expanse of white (or dark) background. On the left, a subtle, undulating wave pattern made of architecture wireframes (Three.js) is visible. As you scroll, the pattern shifts geometry and color (cyan to white) as it dynamically loads and fades in high-fidelity renders of your projects, seamlessly transitioning from USA to international work.

4. Typography & Layout
Font: Helvetica Neue (the classic minimalist choice). Implement a very clean, hierarchical typesetting rule that your agents must follow.

Standards: Standardized spacing, large headers for project names, very precise alignment (e.g., all project details Cape Fear, NC, USA aligned to the right, using monospaced numbering).

Part 2: AI Processing of Architectural Renders
You have great architectural visualizations (image_0.png through image_7.png), but they are currently static flat files. To use them efficiently in a futuristic website, they need to be decomposed and enhanced via AI into dynamic layered assets.

The Workflow: Segmentation, Enhancement, and Outlining
AI Upsampling & Detail Enhancement: The first step is to use an AI image enhancement tool (e.g., Magnific AI or Topaz Photo AI via API) to upsample the original render resolution and generate finer, sharper details on textures (wood, brick, glass reflections) without distorting the structure.

Semantic Segmentation (Background Removal & Layering): Do not simply remove the background and save as one PNG. Use semantic segmentation (tools like U2-Net or modern AI masking) to break the render into intelligent, stackable layers:

Base Architecture Layer: The main building structure (image_0.png house), isolated cleanly from the sky and surrounding context.

Environment Layer: Isolated distant hills, the specific trees in image_0.png, the foreground park cars and flagpoles in image_3.png.

Context Layer: Just the sky, or just the pavement.

Border/Silhouette Extraction (Schematic Wireframe): Generate a perfect vector silhouette outline of the building structure from Layer 1. This can be achieved with classic edge detection (Canny) or modern segmentation edge models.

How to Use These Processed Assets Dynamically (Examples):
Depth and Parallax: When the project page loads, use GSAP to animate the isolated Base Architecture Layer scrolling at a different speed than the Environment Layer. This gives flat images genuine depth.

"Pop-up" Schematic Animation: Before the full color image loads, animate the generated Silhouette Outline on screen using GSAP DrawSVG. It looks like a futuristic blueprint line drawing that suddenly "fills" with the full render.

Context Shifting: You can take the isolated modern house from image_0.png and use a generative AI (like Stable Diffusion/Adobe Firefly) to seamlessly replace the forest setting with a futuristic, neon-drenched cityscape while keeping the building geometry 100% accurate.

Part 3: ChatGPT Prompt for Render Processing
You will pass this prompt to an agentic AI image tool or a Code/Design agent structured to call an API (like DALL-E 3 or a Stable Diffusion setup that accepts complex instructions). You need a multi-stage instruction.

The Master Prompt Structure:
Paste this entire block into ChatGPT or your agent:

Prompt: Architectural Image Processor & Animator
Role: Assume the role of an expert AI Image Architect and Web-Asset Processor. Your objective is to take a flat, high-fidelity architectural render (specifically referencing my attached images, e.g., the modern building in image_3.png) and decompose it into layered, optimized web components.

Goal: Enhance and process the render for maximum efficiency and dynamic animation on a futuristic architecture studio portfolio website.

Stage 1: Render Enhancement (High Resolution)

Increase the resolution and texture detail of the input render by 2x. Focus on sharpening geometric lines, texture definition (like the dark cladding and wood paneling in image_1.png), and glass reflections without altering the architectural form. Denoisethe background.

Stage 2: Semantic Segmentation (Background/Foregound Separation)

Analyze the enhanced render and decompose it into intelligent, stackable semantic layers. Generate a transparent PNG for each:

Layer_01_BaseStructure: Clean isolation of only the main building (e.g., the full structure shown in image_4.png or image_6.png). Remove ALL foreground objects (people, cars, trees).

Layer_02_ContextObjects: Generate a transparent layer containing only the specific clutter/context objects removed from Layer 1 (e.g., the specific grouping of trees from image_0.png, the foreground pond and cars from image_3.png, and the specific group of people from image_2.png).

Layer_03_EnvironmentContext: Generate a transparent layer of the specific background hills and unique foliage context (distinct from individual foreground objects).

Layer_04_Sky: Pure sky layer.

Stage 3: Border/Silhouette Outline Generation

Using Layer_01_BaseStructure, generate a high-quality, pixel-perfect monochrome (e.g., cyan/white) vector-like edge silhouette outline that defines the entire geometric form of the building. This outline must be perfectly clean, as if drawn with a drafting pen, suitable for blueprint-style loading animations.

Stage 4: Context Variant Generation (Optional Futuristic Swap)

Take the isolated structure from Stage 2 (Layer_01) and generate an entirely new, seamless environment. The original geometry of the building must be 100% respected. Swap the current setting (e.g., the hills of image_0.png) with a futuristic, glowing neon grid cityscape, with reflections on the glass showing a futuristic context.

Final Output Format: Provide a layered file (e.g., PSD with smart layers, or a directory structure of optimized, transparent webp/PNG files, and one SVG outline).

End Prompt
Execution via Agentic Tools
When you building the website using agentic tools:

Have your Content Agent execute the AI processing prompt on all your original renders. It will provide a set of layered assets (Architecture, Context, Sky, Outline).

Provide these processed assets to your Code Implementation Agent along with the animation plan. For example, give it the structure layers and outline SVG and instruct: "Create a portfolio deep-dive carousel for Cape Fear. As each image loads, animate the blueprint SVG outline first, then fade in the architecture layer with a slight perspective tilt on mouse movement."