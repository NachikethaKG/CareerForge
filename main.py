import sys
import asyncio
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 1. Force the correct Windows Event Loop immediately
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Import our custom agents
from agents.resume_parser import parse_resume
from agents.job_scraper import scrape_job_board
from agents.matcher import evaluate_match

app = FastAPI(title="CareerForge AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvaluationRequest(BaseModel):
    resume_text: str
    job_url: str

@app.post("/api/evaluate-job")
async def evaluate_job_endpoint(request: EvaluationRequest):
    print(f"\n🚀 Starting evaluation for: {request.job_url}")
    try:
        print("📝 Parsing resume...")
        parsed_resume = parse_resume(request.resume_text)
        
        print("🕵️ Scraping job board...")
        job_description = await scrape_job_board(request.job_url)
        
        if not job_description:
            raise HTTPException(status_code=400, detail="Failed to extract job description.")
            
        print("🧠 Analyzing fit...")
        match_analysis = evaluate_match(parsed_resume, job_description)
        
        print("✅ Evaluation complete!")
        return {
            "status": "success",
            "job_url": request.job_url,
            "parsed_resume": parsed_resume.model_dump(),
            "analysis": match_analysis.model_dump()
        }
    except Exception as e:
        print(f"❌ Error during evaluation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "CareerForge AI Backend is running!"}

# 2. Run Uvicorn from INSIDE Python to protect the Event Loop
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)