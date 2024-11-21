// src/lib/utils/crud.js
import pool from '$lib/db.js';

const allowedTables = ['ITEMLIST', 'FACTORYLIST', 'RECEIPTLIST', 'FACTORYLINE', 'DELIVERYLINE'];

export async function getAllItems({ tableName }) {
	// 테이블 이름 검증
	if (!allowedTables.includes(tableName)) {
		throw new Error('Invalid table name');
	}

	try {
		const query = `SELECT * FROM \`${tableName}\``;
		const [rows] = await pool.query(query);

		return new Response(JSON.stringify(rows), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Database query error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch items' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function getSingleItem({ params, tableName, idColumn }) {
	const { id } = params;

	// 테이블 이름 검증
	if (!allowedTables.includes(tableName)) {
		throw new Error('Invalid table name');
	}

	try {
		const query = `SELECT * FROM \`${tableName}\` WHERE \`${idColumn}\` = ?`;
		const [rows] = await pool.query(query, [id]);

		if (rows.length === 0) {
			return new Response(JSON.stringify({ error: 'Item not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify(rows[0]), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Database query error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch item' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function createItem({ request, tableName, columns }) {
	// 테이블 이름 검증
	if (!allowedTables.includes(tableName)) {
		throw new Error('Invalid table name');
	}

	const data = await request.json();

	// 입력 데이터 검증
	const values = columns.map((col) => data[col]);
	if (values.includes(undefined)) {
		return new Response(JSON.stringify({ error: 'Missing required fields' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const placeholders = columns.map(() => '?').join(', ');
	const columnNames = columns.map((col) => `\`${col}\``).join(', ');
	const query = `INSERT INTO \`${tableName}\` (${columnNames}) VALUES (${placeholders})`;

	try {
		const [result] = await pool.query(query, values);
		return new Response(JSON.stringify({ message: 'Item created', id: result.insertId }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Database insert error:', error);
		return new Response(JSON.stringify({ error: 'Failed to create item' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function updateItem({ params, request, tableName, idColumn, columns }) {
	const { id } = params;

	// 테이블 이름 검증
	if (!allowedTables.includes(tableName)) {
		throw new Error('Invalid table name');
	}

	const data = await request.json();

	// 입력 데이터 검증
	const values = columns.map((col) => data[col]);
	if (values.includes(undefined)) {
		return new Response(JSON.stringify({ error: 'Missing required fields' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const setClause = columns.map((col) => `\`${col}\` = ?`).join(', ');
	values.push(id); // WHERE 절의 ID 추가
	const query = `UPDATE \`${tableName}\` SET ${setClause} WHERE \`${idColumn}\` = ?`;

	try {
		const [result] = await pool.query(query, values);
		if (result.affectedRows === 0) {
			return new Response(JSON.stringify({ error: 'Item not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		return new Response(JSON.stringify({ message: 'Item updated' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Database update error:', error);
		return new Response(JSON.stringify({ error: 'Failed to update item' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function deleteItem({ params, tableName, idColumn }) {
	const { id } = params;

	// 테이블 이름 검증
	if (!allowedTables.includes(tableName)) {
		throw new Error('Invalid table name');
	}

	const query = `DELETE FROM \`${tableName}\` WHERE \`${idColumn}\` = ?`;

	try {
		const [result] = await pool.query(query, [id]);
		if (result.affectedRows === 0) {
			return new Response(JSON.stringify({ error: 'Item not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		return new Response(JSON.stringify({ message: 'Item deleted' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Database delete error:', error);
		return new Response(JSON.stringify({ error: 'Failed to delete item' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}