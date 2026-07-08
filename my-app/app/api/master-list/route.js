import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { verifyAdminSessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { checkRateLimit } from "@/lib/rateLimit";
import { logApiError } from "@/lib/auditLogger";

const VALID_SOURCES = {
    'solution.json' : { file: 'solution', paths: ['solutions', 'services']},
    'products.json' : { file: 'products', paths: ['brands']},
    'insight.json' : { file: 'insight', paths: ['articles.items', 'news.items']},
};

// Path validation regex - prevent path traversal
const SAFE_PATH_REGEX = /^[a-zA-Z0-9._]+$/;

async function checkAuth(request) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    return await verifyAdminSessionToken(token, request);
}

export async function GET(request) {
    // 1. Authentication
    if(!await checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized'}, { status: 401});
    }

    // 2. Rate limiting
    const rateLimit = await checkRateLimit(request, 'master_list', {
        limit: 30,
        windowSeconds: 60,
        lockoutSeconds: 300,
    });

    if(!rateLimit.allowed) {
        return NextResponse.json({
            error: 'Rate limit exceeded'
        }, {
            status: 429,
            headers: { 'Retry-After': String(rateLimit.retryAfter) }
        });
    }

    // 3. Input validation
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const path = searchParams.get('path');

    // 4. Path traversal prevention
    if(!path || !SAFE_PATH_REGEX.test(path)) {
        return NextResponse.json({
            error: 'Invalid path format'
        }, {status: 400});
    }

    //validating source
    if(!source || !VALID_SOURCES[source]) {
        return NextResponse.json({
            error: 'Invalid source',
            validSources: Object.keys(VALID_SOURCES)
        }, {status: 400});
    }

    //validating path
    const sourceConfig = VALID_SOURCES[source];
    if(!sourceConfig.paths.includes(path)) {
        return NextResponse.json({
            error: 'Invalid path',
            validPaths: sourceConfig.paths
        }, {status: 400});
    }

    try{
        //get data from source file
        const data = getContent(sourceConfig.file);

        //navigate to the path safely
        const pathParts = path.split('.');
        let items = data;
        for(const part of pathParts) {
            if(items === null || items === undefined) {
                return NextResponse.json({
                    error: 'Path not found',
                    source,
                    path
                }, {status: 404});
            }
            items = items[part];
        }

        if(!items || !Array.isArray(items)) {
            return NextResponse.json({
                error: 'Path not found or not an array',
                source,
                path
            }, {status: 404});
        }

        // 5. Sanitize output - remove sensitive fields
        const sanitizedItems = items.map(item => {
            const { password, secret, token, key, privateKey, ...safeItem } = item;
            return safeItem;
        });

        // 6. Log access
        console.log(`[MasterList] User accessed ${source}:${path} - ${sanitizedItems.length} items`);

        //Return items
        return NextResponse.json({
            success: true,
            source,
            path,
            items: sanitizedItems
        });

    } catch (err) {
        await logApiError('/api/master-list', 500, err?.message, request);
        return NextResponse.json({error: 'Failed to load master list'}, {status: 500});
    }
}
