from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DUALMIND API",
    description="Knowledge intelligence and multi-agent decision platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "dualmind", "phase": "m1-m2"}


# Module folders reserved for later milestones:
# ingestion, extraction, graph, analytics, retrieval,
# agents, debate, synthesis, evaluation, decisions,
# execution, observability
