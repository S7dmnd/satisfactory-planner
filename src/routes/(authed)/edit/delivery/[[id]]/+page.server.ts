import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login';
import { getAllItem, getAllFactory, getSingleDelivery } from '$lib/server/crudWithAuth';
import { addRow, editRow } from '$lib/server/crudWithAuth';

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
		const rowId = formData.get('ROWID');
		const rowData = {
			RECIPEKEY: formData.get('RECIPEKEY'),
			LINEAMOUNT: Number(formData.get('LINEAMOUNT')),
			TODOAMOUNT: Number(formData.get('TODOAMOUNT')),
			FACTORYID: Number(formData.get('FACTORYID')),
			EXTRAAMOUNT1: Number(formData.get('EXTRAAMOUNT1')) || 0,
			EXTRAAMOUNT2: Number(formData.get('EXTRAAMOUNT2')) || 0,
		};
		const userId = formData.get('USERID');

		console.log(rowId);

		if (rowId !== null) {
			try {
				// 필수 값 검증
				if (!userId || !rowData.RECIPEKEY || !rowData.LINEAMOUNT || !rowData.TODOAMOUNT || !rowData.FACTORYID) {
					return fail(400, { error: 'Missing required fields' });
				}

				// DB 업데이트
				const result = await editRow({ userId, rowId, rowData });

				if (!result.success) {
					return fail(500, { error: result.error || 'Failed to edit row' });
				}

				// 성공 시 리다이렉트
			} catch (error) {
				console.error('Error in editRow action:', error);
				return fail(500, { error: 'An unexpected error occurred. Please try again.' });
			}
			redirect(303, `/factories`);
		}
		else {
			try {
				// 필수 값 검증
				if (!userId || !rowData.RECIPEKEY || !rowData.LINEAMOUNT || !rowData.TODOAMOUNT || !rowData.FACTORYID) {
					return fail(400, { error: 'Missing required fields' });
				}

				// DB에 데이터 추가
				const result = await addRow({ userId, rowData });

				if (!result.success) {
					return fail(500, { error: result.error || 'Failed to add row' });
				}

				// return { success: true, message: 'Row added successfully', rowId: result.rowId };
			} catch (error) {
				console.error('Error in addRow action:', error);
				return fail(500, { error: 'An unexpected error occurred. Please try again.' });
			}
			redirect(303, `/factories`);
		}
	}
};