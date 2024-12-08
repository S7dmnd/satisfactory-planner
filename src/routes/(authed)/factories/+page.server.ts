import type { PageServerLoad } from './$types';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login';
import { getAllDeliveryView, getAllFactoryLineView } from '$lib/server/crudWithAuth';

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('jwt');
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const userId = decoded.userId;

    const factoryLineResponse = await getAllFactoryLineView({ userId });
    if (!factoryLineResponse.ok) {
        throw new Error(`error during fetching FACTORYLINEVIEW! status: ${factoryLineResponse.status}`);
    }
    const factoryLines = await factoryLineResponse.json();

    const deliveryResponse = await getAllDeliveryView({ userId });
    if (!deliveryResponse.ok) {
        throw new Error(`error during fetching DELIVERYVIEW! status: ${deliveryResponse.status}`);
    }
    const deliveries = await deliveryResponse.json();

    return { userId, factoryLines, deliveries };
};