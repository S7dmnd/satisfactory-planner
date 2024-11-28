import type { PageServerLoad } from './$types';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login';
import { getAllTodoList } from '$lib/server/crudWithAuth';

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('jwt');
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const userId = decoded.userId;

    const response = await getAllTodoList({ userId });
    if (!response.ok) {
        throw new Error(`error during fetching TODOS! status: ${response.status}`);
    }

    const todos = await response.json();
    return { userId, todos };
};