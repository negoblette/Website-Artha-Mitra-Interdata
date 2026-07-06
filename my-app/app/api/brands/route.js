import { NextResponse } from 'next/server';
import { readFile, writeFile} from 'fs/promises';
import { join } from 'path';



const PRODUCTS_FILE = join(process.cwd(), 'data', 'products.json');
const BACKUP_DIR = join(process.cwd(), 'data', 'backups');

export async function POST(request) {
    try{
        //input parsing
        const newBrand = await request.json();
        
        //input validation 
        if(!newBrand.name || !newBrand.slug) {
            return NextResponse.json (
                { error: 'Name & Slug are required' },
                { status: 400 },
            );
        }

        //read current data
        const data = await readFile(PRODUCTS_FILE, 'utf-8');
        const products = JSON.parse(data);

        //duplicacy check
        const duplicate = products.brands.find((b) => b.slug === newBrand.slug || b.name === newBrand.name);
        if(duplicate) {
            return NextResponse.json(
                { error: 'Brand with this name or slug is already exists' },
                { status: 400 },
            );
        }


        //backup data
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = join(BACKUP_DIR, `products_${timestamp}.json`);
        await writeFile(backupPath , data);

        //adding new data (brand)
        products.brands.push(newBrand);

        //saving to file
        await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));

        //response success
        return NextResponse.json({
            success: true, 
            message: 'Brand added successfully',
            brands : products.brands,
        });
    }catch(error) {
        console.error('Error adding Brand:', error);
        return NextResponse.json(
            { error: 'Failed to add brand' },
            { status: 500 },
        );
    }
}


export async function GET() {
    try {
        const data = await readFile(PRODUCTS_FILE, 'utf-8');
        const products = JSON.parse(data);
        return NextResponse.json({
            success: true,
            brands: products.brands || [],
        });
    } catch(error) {
        console.error('Error reading Brands:', error);
        return NextResponse.json(
            { error: 'Failed to read brands '},
            { status: 500 },
        );
    }
}