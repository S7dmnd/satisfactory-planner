// src/lib/utils/crud.js
import pool from '$lib/server/db.js';

const allowedTables = ['ITEMLIST', 'FACTORYLIST', 'RECIPELIST', 'FACTORYLINE', 'DELIVERYLINE', 'RECIPEVIEW'];

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

export async function uploadRecipes({ request }) {
    // 요청에서 JSON 데이터 가져오기
    const dataList = await request.json();

    // 삽입할 컬럼 정의 (스키마)
    const columns = [
        'RECIPEKEY', 'INITEM1', 'INAMOUNT1', 'INITEM2', 'INAMOUNT2',
        'INITEM3', 'INAMOUNT3', 'INITEM4', 'INAMOUNT4',
        'OUTITEM1', 'OUTAMOUNT1', 'OUTITEM2', 'OUTAMOUNT2', 'ALTERNATE'
    ];

    // Prepared Statement를 위한 자리표시자와 컬럼 이름 생성
    const placeholders = columns.map(() => '?').join(', ');
    const columnNames = columns.map((col) => `\`${col}\``).join(', ');
    const query = `INSERT INTO \`RECIPELIST\` (${columnNames}) VALUES (${placeholders})`;

    try {
        // 데이터 검증 및 삽입 처리
        for (const data of dataList) {
            const values = [
                data.CLASSNAME, // RECIPEKEY
                data.INITEM1, // INITEM1
                data.INAMOUNT1, // INAMOUNT1
                data.INITEM2 || null, // INITEM2
                data.INAMOUNT2 || null, // INAMOUNT2
                data.INITEM3 || null, // INITEM3
                data.INAMOUNT3 || null, // INAMOUNT3
                data.INITEM4 || null, // INITEM4
                data.INAMOUNT4 || null, // INAMOUNT4
                data.OUTITEM1, // OUTITEM1
                data.OUTAMOUNT1, // OUTAMOUNT1
                data.OUTITEM2 || null, // OUTITEM2
                data.OUTAMOUNT2 || null, // OUTAMOUNT2
                data.ALTERNATE // ALTERNATE
            ];

            // 필수 값 검증
            if (values[0] === undefined || values[9] === undefined || values[10] === undefined) {
                return new Response(
                    JSON.stringify({ error: `Missing required fields in data: ${JSON.stringify(data)}` }), { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // SQL 실행
            await pool.query(query, values);
        }

        // 성공 응답 반환
        return new Response(JSON.stringify({ message: 'Recipes uploaded successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Database insert error:', error);
        return new Response(JSON.stringify({ error: 'Failed to upload recipes' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function uploadItems({ request }) {
    // 요청 JSON 데이터 가져오기
    const dataList = await request.json();

    // 필수 컬럼 정의
    const columns = ['ITEMKEY', 'KO', 'EN'];
    const placeholders = columns.map(() => '?').join(', ');
    const columnNames = columns.map((col) => `\`${col}\``).join(', ');
    const query = `INSERT INTO \`ITEMLIST\` (${columnNames}) VALUES (${placeholders})`;

    // 데이터 검증 및 처리
    try {
        // 누락된 필드 확인
        for (const data of dataList) {
            const values = [
                data.CLASSNAME,
                data.NAME.KO,
                data.NAME.EN
            ];
            if (values.includes(undefined) || values.includes(null)) {
                return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        // 데이터를 순회하며 삽입
        const promises = dataList.map((data) => {
            const values = [
                data.CLASSNAME,
                data.NAME.KO,
                data.NAME.EN
            ];
            return pool.query(query, values);
        });

        // 모든 삽입 쿼리 실행
        const results = await Promise.all(promises);

        // 응답 생성
        return new Response(
            JSON.stringify({
                message: 'Items created',
                insertedIds: results.map((result) => result[0].insertId),
            }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Database insert error:', error);
        return new Response(JSON.stringify({ error: 'Failed to create items' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function updateTodo({ params }) {
    const { id } = params;

    const query = `UPDATE FACTORYLINE SET TODOAMOUNT = 0 WHERE ROWID = ${id}`;

    try {
        const [result] = await pool.query(query);
        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'Row not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ message: 'Todo updated' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Database update error:', error);
        return new Response(JSON.stringify({ error: 'Failed to update Todo' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}