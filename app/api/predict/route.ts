import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic'; // Ensure this runs server-side

export async function POST(request: Request) {
  try {
    const { homeTeamStats, awayTeamStats, homeRestDays } = await request.json();

    // Validate input matches your model's features
    if (!homeTeamStats || !awayTeamStats || homeRestDays === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Prepare features in EXACT SAME ORDER as training
    const features = [
      homeTeamStats.avg_pts,          // home_avg_pts
      awayTeamStats.avg_pts_allowed,  // away_avg_pts_allowed
      homeTeamStats.win_pct,          // home_win_pct
      homeRestDays                    // home_rest_days
    ];

    // Call Python script
    const pythonScriptPath = path.join(process.cwd(), 'predict.py');
    const pythonProcess = spawn('python3', [
      pythonScriptPath,
      JSON.stringify(features)
    ]);

    // Get prediction
    let prediction = '';
    for await (const data of pythonProcess.stdout) {
      prediction += data.toString();
    }

    const homeWinProbability = parseFloat(prediction);

    return NextResponse.json({
      success: true,
      homeWinProbability,
      featuresUsed: features // For debugging
    });

  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}