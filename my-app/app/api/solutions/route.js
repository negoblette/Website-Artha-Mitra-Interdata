import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises';
import { join } from 'path';

const SOLUTION_FILE = join(process.cwd(), 'data', 'solution.json');

export async function GET() {
    try{
        const data = await readFile(SOLUTION_FILE, 'utf-8');
        const solutionData = JSON.parse(data);
        return NextResponse.json({
            success: true,
            solutions: solutionData.solutions || [],
        }) ;
    } catch (error) {
        console.error('Error reading solutions:', error);
        return NextResponse.json({ error: 'Failed to read solutions' }, { status: 500 });
    }
}