# [oss-orb](https://github.com/oss-slu/oss-orb.git) | [Open Source with SLU](https://oss-slu.github.io)
## Open Source Repository Browser
- Building a modern web architecture around the work originally done by the [UC OSPO Network](https://ucospo.net)

# Tech stack:
- ## Frontend
    ### */app*
    - Typescript
    - React
    - Vite
    - Nginx
- ## Backend
    ### */api*
    - Typescript
    - NodeJS
    - Express

## Project installation/setup
### 1. Download and install [Docker Desktop](https://www.docker.com/get-started/)
### 2. Clone the repository & open project locally
`git clone https://github.com/oss-slu/oss-orb.git`<br>`cd oss-orb`
### 3. Run project with Docker compose
The frontend can be served by nginx via the *app* container (production behavior) or with vite's dev server for developers to take advantage of hot reloading.
- #### Use docker frontend:
    - Start frontend and backend containers:<br>`docker compose up --build -d`
    - ***Frontend should now be accessible in your browser via Nginx at http://localhost:8087***

- #### Run frontend via vite development server:
    - First, ensure [Node JS](https://nodejs.org/en) is installed<br>
    - Run backend container:<br>`docker compose up api --build -d`
    - Run vite dev server:<br>`cd app && npm ci && npm run dev`<br>
    - ***Frontend should now be accessible in your browser via Vite at http://localhost:6284***

### 4. Optionally, download the UC OSPO Network Parquet file locally:
- See instructions in [dev scripts file](/docs/dev/setup_scripts.md)