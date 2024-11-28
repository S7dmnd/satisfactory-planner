import type { PageServerLoad } from './$types';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login';
import { getAllFactoryLineView } from '$lib/server/crudWithAuth';

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('jwt');
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const userId = decoded.userId;

    const response = await getAllFactoryLineView({ userId });
    if (!response.ok) {
        throw new Error(`error during fetching FACTORYLINEVIEW! status: ${response.status}`);
    }

    const factoryLines = await response.json();
    return { userId, factoryLines };
};