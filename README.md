# DUALMIND

**Explore the connections. Challenge the thinking. Discover the direction.**

AI-powered knowledge intelligence and multi-agent decision platform.

## Current phase: Milestones 1–2

- Design system and command-centre shell
- Six application sections (Nexus, Lab, Dual, Synthesis, Mission, Vault)
- Interactive 3D/2D Nexus over a curated sample knowledge graph
- Real Graphology analytics (PageRank, betweenness, Louvain communities, structural gaps)
- FastAPI backend scaffold (`/health`)

Live ingestion, agents, and synthesis arrive in later milestones. This build does **not** fabricate AI inference or graph metrics.

## Web app

```bash
cd brain
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend scaffold

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## License posture

Original DUALMIND implementation. Inspiration drawn from text-network analysis and multi-agent debate research; no proprietary source code was copied.
