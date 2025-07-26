# Future Plans: Integrating Local LLM with NBA Prediction Model

## Overview
This document outlines the plan to enhance our existing NBA matchup predictor (scikit-learn) by adding a natural language interface using a local LLM (via Ollama). The goal is to:
1. **Explain predictions** in human-readable terms.
2. **Answer user questions** about stats, teams, and historical trends.
3. **Explore "what-if" scenarios** (e.g., injuries, lineup changes).

---

## Phase 1: Setup Ollama + Basic Integration
### Tasks:
- [ ] Install [Ollama](https://ollama.ai/) locally and test models (`mistral`, `llama3`).
- [ ] Create a Flask/FastAPI endpoint that:
  - Takes a user query (e.g., `"Who wins Lakers vs. Celtics?"`).
  - Calls the existing scikit-learn model for win probabilities.
  - Passes the raw prediction + stats to Ollama for explanation.
- [ ] Example prompt template:
  ```text
  The model predicts {team1} has a {win_prob}% chance to win against {team2}. 
  Key stats: {team1} offensive rating: {ortg}, {team2} rebound rate: {reb_rate}.
  Explain this prediction in 1-2 sentences for a basketball fan.