import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { homeTeamId, awayTeamId, homeRestDays } = await request.json();

    // Validate input
    if (!homeTeamId || !awayTeamId || homeRestDays === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (homeTeamId === awayTeamId) {
      return NextResponse.json(
        { error: 'Home and away teams cannot be the same' },
        { status: 400 }
      );
    }

    if (homeRestDays < 0 || homeRestDays > 7) {
      return NextResponse.json(
        { error: 'Rest days must be between 0-7' },
        { status: 400 }
      );
    }

    // Call Python script
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'lib\\predict.py'),
      JSON.stringify({
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_rest_days: homeRestDays
      })
    ]);

    // Collect output
    let result = '';
    for await (const data of pythonProcess.stdout) {
      result += data.toString();
    }

    // Handle Python script errors
    let errorOutput = '';
    for await (const data of pythonProcess.stderr) {
      errorOutput += data.toString();
    }

    if (errorOutput) {
      console.error('Python error:', errorOutput);
      throw new Error(errorOutput);
    }

    // Parse the JSON response
    const predictionResult = JSON.parse(result);

    if (predictionResult.error) {
      return NextResponse.json(
        { error: predictionResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      homeWinProbability: predictionResult.probability,
      featureDetails: predictionResult.features,
      metadata: {
        homeTeamId,
        awayTeamId,
        homeRestDays
      }
    });

  } catch (error) {
    console.error('Prediction error:', error);
    
    // Handle different error types
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid prediction response format';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: statusCode }
    );
  }
}