import authorizer from "@/server/middleware/authorizer";
import handleError from "@/utils/handle-error";
import { cookies } from "next/headers";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		await authorizer();

		cookies().delete("token");

		return NextResponse.json(
			{ message: "Logout successfully!", success: true },
			{ status: 200 }
		);
	} catch (error) {
		return handleError(error);
	}
}
