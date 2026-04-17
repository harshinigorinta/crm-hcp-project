from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from typing import TypedDict, Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize the Groq LLM
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

# This defines what data flows through our agent
class AgentState(TypedDict):
    action: str
    input_text: str
    hcp_name: Optional[str]
    hcp_specialty: Optional[str]
    date: Optional[str]
    location: Optional[str]
    product_discussed: Optional[str]
    notes: Optional[str]
    summary: Optional[str]
    sentiment: Optional[str]
    follow_up_date: Optional[str]
    interaction_id: Optional[int]
    result: Optional[str]

# ─────────────────────────────────────────
# TOOL 1: Log Interaction
# ─────────────────────────────────────────
def log_interaction_tool(state: AgentState) -> AgentState:
    prompt = f"""
    You are a CRM assistant for a pharmaceutical sales rep.
    Extract the following details from this interaction note:
    - HCP Name
    - Specialty
    - Date
    - Location
    - Product Discussed
    - Notes summary
    - Sentiment (positive/neutral/negative)
    - Follow-up date if mentioned

    Interaction note: {state['input_text']}

    Respond in this exact format:
    HCP Name: ...
    Specialty: ...
    Date: ...
    Location: ...
    Product: ...
    Notes: ...
    Sentiment: ...
    Follow-up: ...
    """
    response = llm.invoke(prompt)
    lines = response.content.strip().split("\n")
    for line in lines:
        if "HCP Name:" in line:
            state["hcp_name"] = line.split(":", 1)[1].strip()
        elif "Specialty:" in line:
            state["hcp_specialty"] = line.split(":", 1)[1].strip()
        elif "Date:" in line:
            state["date"] = line.split(":", 1)[1].strip()
        elif "Location:" in line:
            state["location"] = line.split(":", 1)[1].strip()
        elif "Product:" in line:
            state["product_discussed"] = line.split(":", 1)[1].strip()
        elif "Notes:" in line:
            state["notes"] = line.split(":", 1)[1].strip()
        elif "Sentiment:" in line:
            state["sentiment"] = line.split(":", 1)[1].strip()
        elif "Follow-up:" in line:
            state["follow_up_date"] = line.split(":", 1)[1].strip()
    state["result"] = "Interaction logged successfully!"
    return state

# ─────────────────────────────────────────
# TOOL 2: Edit Interaction
# ─────────────────────────────────────────
def edit_interaction_tool(state: AgentState) -> AgentState:
    prompt = f"""
    You are a CRM assistant. The user wants to edit an existing interaction.
    Extract what fields they want to change from this text:
    {state['input_text']}

    Respond in this exact format:
    HCP Name: ...
    Specialty: ...
    Date: ...
    Location: ...
    Product: ...
    Notes: ...
    Sentiment: ...
    Follow-up: ...

    Only fill in the fields that are mentioned. Write "unchanged" for others.
    """
    response = llm.invoke(prompt)
    lines = response.content.strip().split("\n")
    for line in lines:
        if "HCP Name:" in line:
            val = line.split(":", 1)[1].strip()
            if val != "unchanged":
                state["hcp_name"] = val
        elif "Specialty:" in line:
            val = line.split(":", 1)[1].strip()
            if val != "unchanged":
                state["hcp_specialty"] = val
        elif "Date:" in line:
            val = line.split(":", 1)[1].strip()
            if val != "unchanged":
                state["date"] = val
        elif "Location:" in line:
            val = line.split(":", 1)[1].strip()
            if val != "unchanged":
                state["location"] = val
        elif "Product:" in line:
            val = line.split(":", 1)[1].strip()
            if val != "unchanged":
                state["product_discussed"] = val
        elif "Notes:" in line:
            val = line.split(":", 1)[1].strip()
            if val != "unchanged":
                state["notes"] = val
        elif "Sentiment:" in line:
            val = line.split(":", 1)[1].strip()
            if val != "unchanged":
                state["sentiment"] = val
        elif "Follow-up:" in line:
            val = line.split(":", 1)[1].strip()
            if val != "unchanged":
                state["follow_up_date"] = val
    state["result"] = "Interaction updated successfully!"
    return state

# ─────────────────────────────────────────
# TOOL 3: Summarize Interaction
# ─────────────────────────────────────────
def summarize_tool(state: AgentState) -> AgentState:
    prompt = f"""
    Summarize this HCP interaction in 2-3 sentences for a pharmaceutical sales rep:
    {state['input_text']}
    """
    response = llm.invoke(prompt)
    state["summary"] = response.content.strip()
    state["result"] = state["summary"]
    return state

# ─────────────────────────────────────────
# TOOL 4: Get HCP Info
# ─────────────────────────────────────────
def get_hcp_info_tool(state: AgentState) -> AgentState:
    prompt = f"""
    You are a pharmaceutical CRM assistant.
    Based on the name "{state['input_text']}", provide a brief professional profile
    of what this type of HCP (Healthcare Professional) might look like including:
    - Likely specialty
    - Common products they would be interested in
    - Best approach for a sales rep visiting them
    Keep it short and professional.
    """
    response = llm.invoke(prompt)
    state["result"] = response.content.strip()
    return state

# ─────────────────────────────────────────
# TOOL 5: Schedule Follow-up
# ─────────────────────────────────────────
def schedule_followup_tool(state: AgentState) -> AgentState:
    prompt = f"""
    You are a CRM assistant for a pharmaceutical sales rep.
    Based on this interaction note, suggest the best follow-up action:
    {state['input_text']}

    Provide:
    - Suggested follow-up date (relative, e.g. "in 2 weeks")
    - What to discuss in the follow-up
    - Priority level (High/Medium/Low)
    Keep it short and actionable.
    """
    response = llm.invoke(prompt)
    state["result"] = response.content.strip()
    return state

# ─────────────────────────────────────────
# Router: decides which tool to use
# ─────────────────────────────────────────
def route_action(state: AgentState) -> str:
    action = state.get("action", "")
    if action == "log":
        return "log_interaction"
    elif action == "edit":
        return "edit_interaction"
    elif action == "summarize":
        return "summarize"
    elif action == "get_hcp_info":
        return "get_hcp_info"
    elif action == "schedule_followup":
        return "schedule_followup"
    else:
        return "summarize"

# ─────────────────────────────────────────
# Build the LangGraph
# ─────────────────────────────────────────
def build_agent():
    graph = StateGraph(AgentState)

    graph.add_node("log_interaction", log_interaction_tool)
    graph.add_node("edit_interaction", edit_interaction_tool)
    graph.add_node("summarize", summarize_tool)
    graph.add_node("get_hcp_info", get_hcp_info_tool)
    graph.add_node("schedule_followup", schedule_followup_tool)

    graph.set_conditional_entry_point(route_action)

    graph.add_edge("log_interaction", END)
    graph.add_edge("edit_interaction", END)
    graph.add_edge("summarize", END)
    graph.add_edge("get_hcp_info", END)
    graph.add_edge("schedule_followup", END)

    return graph.compile()

agent = build_agent()