import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login';
import { getAllFactory, getSingleFactoryLine } from '$lib/server/crudWithAuth';
import { addRow, editRow } from '$lib/server/crudWithAuth';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const { id } = params;
	const rowFrame = {
		ROWID: null,
		FACTORYID: null,
		RECIPEKEY: null,
		LINEAMOUNT: 1,
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

	const factoryResponse = await getAllFactory({ userId });
	if (!factoryResponse.ok) {
		throw new Error(`error during fetching FACTORYLINE! status: ${factoryResponse.status}`);
	}
	const factoryList = await factoryResponse.json();

	return { factoryList: factoryList, userId: userId, rowFrame: rowFrame };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		// Validation
		if (!formData.get('USERID') || !formData.get('RECIPEKEY') || !formData.get('LINEAMOUNT') || !formData.get('TODOAMOUNT') || !formData.get('FACTORYID')) {
			return fail(400, { error: 'Missing required fields' });
		}

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

		// Validation
		if (rowData.LINEAMOUNT <= 0 || rowData.TODOAMOUNT < 0 || rowData.EXTRAAMOUNT1 < 0 || rowData.EXTRAAMOUNT2 < 0) {
			return fail(400, { error: 'Amounts cannot be negative' });
		}
		if (rowData.LINEAMOUNT < rowData.TODOAMOUNT) {
			return fail(400, { error: 'Todo Amount must be less than or equal to Line Amount' });
		}

		if (rowId !== null) {
			try {
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