import type { PageServerLoad } from './$types';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login';
import { getAllTodoList } from '$lib/server/crudWithAuth';
import { fail } from '@sveltejs/kit';
import { updateTodo } from '$lib/server/crudWithAuth';

export const load: PageServerLoad = async ({ cookies }) => {
    const ready = true;
    const token = cookies.get('jwt');
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const userId = decoded.userId;

    const response = await getAllTodoList({ userId });
    if (!response.ok) {
        throw new Error(`error during fetching TODOS! status: ${response.status}`);
    }

    const todos = await response.json();
    return { userId, todos, ready };
};

export const actions = {
    updateTodo: async ({ request, cookies, url }) => {
        try {
            const formData = await request.formData();
            const rowId = formData.get('rowId');

            if (!rowId) {
                return fail(400, { error: 'Row ID is required' });
            }

            // JWT 검증
            const token = cookies.get('jwt');
            if (!token) {
                return fail(401, { error: 'Unauthorized: No JWT token provided' });
            }

            let userId;
            try {
                const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
                userId = decoded.userId;
            } catch (jwtError) {
                return fail(401, { error: 'Unauthorized: Invalid JWT token' });
            }

            console.log(`USERID=${userId}, ROWID=${rowId}`);

            // 업데이트 수행
            const result = await updateTodo({ userId, rowId });

            // 에러 검증
            if (!result || result.error) {
                return fail(500, { error: result.error || 'Failed to update todo' });
            }

            // 성공 응답
            return {
                success: true,
                message: `Todo with ROWID=${rowId} successfully updated`,
            };

        } catch (error) {
            console.error('Error in updateTodo action:', error);
            return fail(500, { error: 'An unexpected error occurred. Please try again.' });
        }
    },
};