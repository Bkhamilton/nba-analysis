import { NextResponse } from 'next/server';

interface ModelPrediction {
    probability: number;
    accuracy: number;
}

interface Predictions {
    basic_model: ModelPrediction;
    advanced_model: ModelPrediction;
}

interface Metadata {
    home_team_id: number;
    away_team_id: number;
    home_rest_days: number;
}

interface TeamNames {
    home?: string;
    away?: string;
}

export async function POST(request: Request) {
    try {
        const { predictions, metadata, teamNames } = await request.json();

        // Validate input
        if (!predictions || !metadata) {
            return NextResponse.json(
                { error: 'Missing prediction data' },
                { status: 400 }
            );
        }

        // Prepare the prompt for Ollama
        const prompt = createExplanationPrompt(predictions, metadata, teamNames);

        // Call Ollama API
        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemma3:4b',
                prompt: prompt,
                stream: false
            })
        });

        if (!ollamaResponse.ok) {
            throw new Error('Failed to get explanation from Ollama');
        }

        const explanation = await ollamaResponse.json();

        return NextResponse.json({
            success: true,
            explanation: explanation.response,
            predictions,
            metadata
        });

    } catch (error) {
        console.error('Explanation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate explanation' },
            { status: 500 }
        );
    }
}

function createExplanationPrompt(predictions: Predictions, metadata: Metadata, teamNames?: TeamNames) {
    const basicModel = predictions.basic_model;
    
    const homeTeam = teamNames?.home || `Team ${metadata.home_team_id}`;
    const awayTeam = teamNames?.away || `Team ${metadata.away_team_id}`;
    
    const winProb = Math.round(basicModel.probability * 100);
    const modelAccuracy = Math.round(basicModel.accuracy * 100);

    return `
    You are an NBA analyst explaining a game prediction to basketball fans.

    PREDICTION DATA:
    - ${homeTeam} (home) vs ${awayTeam} (away)
    - Home team win probability: ${winProb}%
    - Model accuracy: ${modelAccuracy}%
    - Home team rest days: ${metadata.home_rest_days}

    TASK: Explain this prediction in 2-3 sentences for a basketball fan. Focus on:
    1. Which team is favored and by how much
    2. Key factors that might influence the outcome
    3. Keep it conversational and informative

    Do not repeat the exact percentages. Make it sound natural.
    `;
}