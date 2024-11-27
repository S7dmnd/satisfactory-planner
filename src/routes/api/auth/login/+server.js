import { loginApi } from '$lib/server/login';

export async function POST(event) {
    return await loginApi({
        request: event.request,
    });
}