import type { PageServerLoad } from './$types';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login';
import { getSingleFactoryLine } from '$lib/server/crudWithAuth';

export const load: PageServerLoad = async ({ cookies, params }) => {
    const { id } = params;
    const rowFrame = {
        ROWID: null,
        FACTORYID: null,
        RECIPEKEY: null,
        LINEAMOUNT: 0,
        TODOAMOUNT: 0,
    };

    const rowId = id; // rowId

    const token = cookies.get('jwt');
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const userId = decoded.userId; // userId

    if (id) {
        const factoryLineResponse = await getSingleFactoryLine({ rowId, userId });
        if (!factoryLineResponse.ok) {
            throw new Error(`error during fetching FACTORYLINE! status: ${factoryLineResponse.status}`);
        }

        const row = await factoryLineResponse.json();
        rowFrame.ROWID = parseInt(id);
        rowFrame.FACTORYID = row.FACTORYID;
        rowFrame.RECIPEKEY = row.RECIPEKEY;
        rowFrame.LINEAMOUNT = row.LINEAMOUNT;
        rowFrame.TODOAMOUNT = row.TODOAMOUNT;
    }

    return { userId: userId, rowFrame: rowFrame };
};