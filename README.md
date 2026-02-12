About
Recollect Space is a web application for storing, organizing and sharing personal photos and
memories. It uses AI to automatically organize photos into personalized folders (face-based
grouping and smart sorting) and provides an integrated blogging experience so users can create
meaningful narratives around their memories.

Features

- AI-driven photo organization: automatically groups photos by detected faces and attributes.
- Face recognition & landmarks: face detection, recognition and landmarking for accurate sorting.
- Smart folders: create, name, and share folders with family and friends.
- Blogging: write posts tied to albums or individual photos; supports simple rich text.
- Secure client-side encryption utilities (see `src/utils/Encryption.js`).
- Lightweight, local model hosting: pre-trained face/age/expression models live in public/models.

Tech stack

- Frontend: React with Vite and Tailwind CSS.
- Client-side AI models: face-api.js model files stored in [public/models](public/models).
- Build tools: Vite, PostCSS. See `package.json` for scripts and dependencies.

Getting started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the app in your browser (usually http://localhost:5173).

Project layout

- [public/models](public/models): pretrained face-api.js models used for detection/recognition.
- [src](src): React source files.
  - [src/components](src/components): UI pages and components (Home, Face, Myfiles, Login, etc.).
  - [src/utils/Encryption.js](src/utils/Encryption.js): client-side encryption helpers.

AI models and data
Model artifacts used by the app are pre-downloaded into [public/models](public/models). These
include face detection, landmark, recognition, expression, and age/gender models used by the
client to analyze and group images without server-side model calls.

Usage notes

- For best face grouping accuracy, upload clear frontal photos with good lighting.
- Model files are loaded from [public/models](public/models); do not remove them unless you
  intend to reconfigure model loading in the code.


