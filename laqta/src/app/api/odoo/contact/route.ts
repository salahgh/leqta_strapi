import { NextRequest, NextResponse } from "next/server";
import handler from "./handler";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await handler(body);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
