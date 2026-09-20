import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

class ResumeData(BaseModel):
    skills: list[str] = Field(description="List of technical and soft skills")
    experience_years: int = Field(description="Total years of professional experience. Use 0 for freshers.")
    projects: list[str] = Field(description="Brief names or descriptions of key projects")
    education_level: str = Field(description="Highest degree obtained or pursuing")

def parse_resume(resume_text: str) -> ResumeData:
    # Initialize Gemini model (reads GEMINI_API_KEY from environment)
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        temperature=0,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    # Enforce structured output via Pydantic
    structured_llm = llm.with_structured_output(ResumeData)
    
    prompt = f"Extract the required information from the following resume text:\n\n{resume_text}"
    
    result = structured_llm.invoke(prompt)
    return result

if __name__ == "__main__":
    sample_resume = "Engineering student graduating soon. Built full-stack apps with Python, FastAPI, and React. Created an AI project called SummAid. Looking for fresher roles."
    parsed_data = parse_resume(sample_resume)
    print(parsed_data.model_dump_json(indent=2))