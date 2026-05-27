from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from zxcvbn import zxcvbn

app = FastAPI()

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordRequest(BaseModel):
    password: str

def get_character_breakdown(password: str):
    return {
        "uppercase": sum(1 for c in password if c.isupper()),
        "lowercase": sum(1 for c in password if c.islower()),
        "digits": sum(1 for c in password if c.isdigit()),
        "symbols": sum(1 for c in password if not c.isalnum())
    }

@app.post("/api/analyze")
async def analyze_password(request: PasswordRequest):
    results = zxcvbn(request.password)
    
    return {
        "score": results["score"],
        "entropy": results["guesses_log10"],
        "crack_times": results["crack_times_display"],
        "feedback": results["feedback"],
        "breakdown": get_character_breakdown(request.password),
        "length": len(request.password)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
