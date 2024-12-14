import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login';
import { getAllItem, getAllFactory, getSingleDelivery, editDelivery, addDelivery } from '$lib/server/crudWithAuth';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const { id } = params;
	const rowFrame = {
		DELIVERYID: null,
		SOURCEID: null,
		DESTINATIONID: null,
		ITEMKEY: null,
		METHOD: '',
		AMOUNT: 0,
	};

	const deliveryId = id;

	const token = cookies.get('jwt');
	const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
	const userId = decoded.userId; // userId

	if (id) {
		const deliveryResponse = await getSingleDelivery({ deliveryId, userId });
		if (!deliveryResponse.ok) {
			throw new Error(`error during fetching FACTORYLINE! status: ${deliveryResponse.status}`);
		}

		const row = await deliveryResponse.json();
		rowFrame.DELIVERYID = parseInt(id);
		rowFrame.SOURCEID = row.SOURCEID;
		rowFrame.DESTINATIONID = row.DESTINATIONID;
		rowFrame.ITEMKEY = row.ITEMKEY;
		rowFrame.METHOD = row.METHOD;
		rowFrame.AMOUNT = row.AMOUNT;
	}

	const factoryResponse = await getAllFactory({ userId });
	if (!factoryResponse.ok) {
		throw new Error(`error during fetching FACTORYLINE! status: ${factoryResponse.status}`);
	}
	const factoryList = await factoryResponse.json();

	const itemResponse = await getAllItem();
	if (!itemResponse.ok) {
		throw new Error(`error during fetching ITEMLIST! status: ${itemResponse.status}`);
	}
	const itemList = await itemResponse.json();

	return { factoryList: factoryList, itemList: itemList, userId: userId, rowFrame: rowFrame };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		// Validation
		if (formData.get('USERID') == null || formData.get('SOURCEID') == null || formData.get('DESTINATIONID') == null || formData.get('ITEMKEY') == null || formData.get('METHOD') == null || formData.get('AMOUNT') == null) {
			return fail(400, { error: 'Missing required fields' });
		}

		const deliveryId = formData.get('DELIVERYID');
		const deliveryData = {
			SOURCEID: Number(formData.get('SOURCEID')) || null,
			DESTINATIONID: Number(formData.get('DESTINATIONID')) || null,
			ITEMKEY: formData.get('ITEMKEY'),
			METHOD: formData.get('METHOD'),
			AMOUNT: Number(formData.get('AMOUNT'))
		};
		const userId = formData.get('USERID');

		// Validation
		if (deliveryData.AMOUNT <= 0) {
			return fail(400, { error: 'Amount must be positive' });
		}

		if (deliveryId !== null) {
			// 수정 로직
			try {
				const result = await editDelivery({ userId, deliveryId, deliveryData });
				if (!result.success) {
					return fail(500, { error: result.error || 'Failed to edit delivery' });
				}
			} catch (error) {
				console.error('Error in edit delivery action:', error);
				return fail(500, { error: 'An unexpected error occurred. Please try again.' });
			}
			throw redirect(303, '/factories');
		} else {
			// 추가 로직
			try {
				const result = await addDelivery({ userId, deliveryData });
				if (!result.success) {
					return fail(500, { error: result.error || 'Failed to add delivery' });
				}
			} catch (error) {
				console.error('Error in add delivery action:', error);
				return fail(500, { error: 'An unexpected error occurred. Please try again.' });
			}
			throw redirect(303, '/factories');
		}
	}
};