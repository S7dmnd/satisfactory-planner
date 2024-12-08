// src/lib/utils/crudWithAuth.js
import pool from '$lib/server/db.js';

const allowedTables = ['ITEMLIST', 'FACTORYLIST', 'RECIPELIST', 'FACTORYLINE', 'DELIVERYLINE', 'RECIPEVIEW'];

export async function getAllFactoryLine({ userId }) {
    try {
        const query = `SELECT * FROM FACTORYLINE WHERE USERID = \`${userId}\``;
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

export async function getAllFactory({ userId }) {
    try {
        const query = `SELECT * FROM FACTORYLIST WHERE USERID = '${userId}'`;
        const [rows] = await pool.query(query);

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Databasequery error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch items' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function getAllFactoryLineView({ userId }) {
    try {
        const query = `SELECT * FROM FACTORYLINEVIEW WHERE USERID = '${userId}'`;
        const [rows] = await pool.query(query);

        // 데이터를 FACTORYNAME에 따라 그룹화
        const groupedData = {};

        rows.forEach(row => {
            const factoryName = row.FACTORYNAME;

            if (!groupedData[factoryName]) {
                groupedData[factoryName] = [];
            }

            // todo 객체 생성 (INITEM과 OUTITEM을 개별 필드로 유지)
            const todo = {
                ROWID: row.ROWID,
                TODOAMOUNT: row.TODOAMOUNT,
                LINEAMOUNT: row.LINEAMOUNT,
                INITEMNAME1: row.INITEMNAME1,
                INAMOUNT1: row.INAMOUNT1,
                INITEMNAME2: row.INITEMNAME2,
                INAMOUNT2: row.INAMOUNT2,
                INITEMNAME3: row.INITEMNAME3,
                INAMOUNT3: row.INAMOUNT3,
                INITEMNAME4: row.INITEMNAME4,
                INAMOUNT4: row.INAMOUNT4,
                OUTITEMNAME1: row.OUTITEMNAME1,
                OUTAMOUNT1: row.OUTAMOUNT1,
                OUTITEMNAME2: row.OUTITEMNAME2,
                OUTAMOUNT2: row.OUTAMOUNT2,
            };

            // 그룹에 todo 추가
            groupedData[factoryName].push(todo);
        });

        // 결과를 배열 형태로 변환
        const result = Object.keys(groupedData).map(factoryName => ({
            FACTORYNAME: factoryName,
            lines: groupedData[factoryName],
        }));

        return new Response(JSON.stringify(result), {
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

export async function getAllTodoList({ userId }) {
    try {
        const query = `SELECT * FROM TODOVIEW WHERE USERID = '${userId}'`;

        const [rows] = await pool.query(query);

        // 데이터를 FACTORYNAME에 따라 그룹화
        const groupedData = {};

        rows.forEach(row => {
            const factoryName = row.FACTORYNAME;

            if (!groupedData[factoryName]) {
                groupedData[factoryName] = [];
            }

            // todo 객체 생성 (INITEM과 OUTITEM을 개별 필드로 유지)
            const todo = {
                ROWID: row.ROWID,
                TODOAMOUNT: row.TODOAMOUNT,
                INITEMNAME1: row.INITEMNAME1,
                INAMOUNT1: row.INAMOUNT1,
                INITEMNAME2: row.INITEMNAME2,
                INAMOUNT2: row.INAMOUNT2,
                INITEMNAME3: row.INITEMNAME3,
                INAMOUNT3: row.INAMOUNT3,
                INITEMNAME4: row.INITEMNAME4,
                INAMOUNT4: row.INAMOUNT4,
                OUTITEMNAME1: row.OUTITEMNAME1,
                OUTAMOUNT1: row.OUTAMOUNT1,
                OUTITEMNAME2: row.OUTITEMNAME2,
                OUTAMOUNT2: row.OUTAMOUNT2,
            };

            // 그룹에 todo 추가
            groupedData[factoryName].push(todo);
        });

        // 결과를 배열 형태로 변환
        const result = Object.keys(groupedData).map(factoryName => ({
            FACTORYNAME: factoryName,
            todos: groupedData[factoryName],
        }));

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Database query error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch todos' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function updateTodo({ userId, rowId }) {
    try {
        // STEP 1: ROWID로 USERID 조회
        const getQuery = `SELECT USERID FROM FACTORYLINE WHERE ROWID = ?`;
        const [rows] = await pool.query(getQuery, [rowId]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Row not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { USERID } = rows[0];

        // STEP 2: USERID 검증
        if (USERID !== userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized: User mismatch' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // STEP 3: TODOAMOUNT 업데이트
        const updateQuery = `UPDATE FACTORYLINE SET TODOAMOUNT = 0 WHERE ROWID = ?`;
        const [result] = await pool.query(updateQuery, [rowId]);

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'Failed to update Todo' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Todo updated successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Database query error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function getSingleFactoryLine({ userId, rowId }) {
    try {
        // SQL Injection 방지를 위해 '?' 플레이스홀더 사용
        const query = `SELECT * FROM FACTORYLINE WHERE USERID = ? AND ROWID = ?`;
        const [rows] = await pool.query(query, [userId, rowId]);

        if (rows.length === 0) {
            // 결과가 없으면 404 응답 반환
            return new Response(JSON.stringify({ error: 'No matching item found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 성공 응답
        return new Response(JSON.stringify(rows[0]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Database query error:', error);

        // 서버 에러 반환
        return new Response(JSON.stringify({ error: 'Failed to fetch item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function editRow({ userId, rowId, rowData }) {
    try {
        // 1. rowId로 SELECT해서 USERID 가져오기
        const selectQuery = `SELECT USERID FROM FACTORYLINE WHERE ROWID = ?`;
        const [rows] = await pool.query(selectQuery, [rowId]);

        if (rows.length === 0) {
            return { success: false, error: 'Row not found' };
        }

        const dbUserId = rows[0].USERID;

        // 2. userId와 일치하는지 검증
        if (dbUserId !== userId) {
            return { success: false, error: 'Unauthorized: User mismatch' };
        }

        // 3. UPDATE 쿼리
        const updateQuery = `
            UPDATE FACTORYLINE
            SET RECIPEKEY = ?, LINEAMOUNT = ?, TODOAMOUNT = ?, FACTORYID = ?, EXTRAAMOUNT1 = ?, EXTRAAMOUNT2 = ?
            WHERE USERID = ? AND ROWID = ?
        `;
        const values = [
            rowData.RECIPEKEY,
            rowData.LINEAMOUNT,
            rowData.TODOAMOUNT,
            rowData.FACTORYID,
            rowData.EXTRAAMOUNT1,
            rowData.EXTRAAMOUNT2,
            userId,
            rowId,
        ];

        const [updateResult] = await pool.query(updateQuery, values);

        if (updateResult.affectedRows === 0) {
            return { success: false, error: 'Failed to update row' };
        }

        return { success: true, message: 'Row updated successfully' };
    } catch (error) {
        console.error('Error in editRow:', error);
        return { success: false, error: 'Failed to process edit row' };
    }
}

export async function addRow({ userId, rowData }) {
    try {
        const query = `
            INSERT INTO FACTORYLINE 
            (RECIPEKEY, LINEAMOUNT, TODOAMOUNT, FACTORYID, EXTRAAMOUNT1, EXTRAAMOUNT2, USERID) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            rowData.RECIPEKEY,
            rowData.LINEAMOUNT,
            rowData.TODOAMOUNT,
            rowData.FACTORYID,
            rowData.EXTRAAMOUNT1,
            rowData.EXTRAAMOUNT2,
            userId, // USERID는 별도로 전달받은 값 사용
        ];

        const [result] = await pool.query(query, values);

        return { success: true, rowId: result.insertId };
    } catch (error) {
        console.error('Error adding row:', error);
        return { success: false, error: 'Failed to add row' };
    }
}

export async function createFactory({ request }) {

    const data = await request.json();
    const columns = ["FACTORYNAME", "USERID"]

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
    const query = `INSERT INTO FACTORYLIST (${columnNames}) VALUES (${placeholders})`;

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

export async function editDelivery({ userId, deliveryId, deliveryData }) {
    try {
        // 1. deliveryId로 SELECT해서 USERID 가져오기
        const selectQuery = `SELECT USERID FROM DELIVERYLINE WHERE DELIVERYID = ?`;
        const [rows] = await pool.query(selectQuery, [deliveryId]);

        if (rows.length === 0) {
            return { success: false, error: 'Row not found' };
        }

        const dbUserId = rows[0].USERID;

        // 2. userId와 일치하는지 검증
        if (dbUserId !== userId) {
            return { success: false, error: 'Unauthorized: User mismatch' };
        }

        // 3. UPDATE 쿼리
        const updateQuery = `
            UPDATE DELIVERYLINE
            SET SOURCEID = ?, DESTINATIONID = ?, ITEMKEY = ?, METHOD = ?, AMOUNT = ?
            WHERE USERID = ? AND DELIVERYID = ?
        `;

        const values = [
            deliveryData.sourceId,
            deliveryData.destinationId,
            deliveryData.itemKey,
            deliveryData.method,
            deliveryData.amount,
            userId,
            deliveryId,
        ];

        const [updateResult] = await pool.query(updateQuery, values);

        if (updateResult.affectedRows === 0) {
            return { success: false, error: 'Failed to update row' };
        }

        return { success: true, message: 'Row updated successfully' };
    } catch (error) {
        console.error('Error in editRow:', error);
        return { success: false, error: 'Failed to process edit row' };
    }
}

export async function addDelivery({ userId, deliveryData }) {
    try {
        const query = `
            INSERT INTO DELIVERYLINE 
            (SOURCEID, DESTINATIONID, ITEMKEY, METHOD, AMOUNT, USERID) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            deliveryData.sourceId,
            deliveryData.destinationId,
            deliveryData.itemKey,
            deliveryData.method,
            deliveryData.amount,
            userId,
        ];

        const [result] = await pool.query(query, values);

        return { success: true, deliveryId: result.insertId };
    } catch (error) {
        console.error('Error adding row:', error);
        return { success: false, error: 'Failed to add row' };
    }
}

export async function getSingleDelivery({ userId, deliveryId }) {
    try {
        const query = `SELECT * FROM DELIVERYLINE WHERE USERID = ? AND DELIVERYID = ?`;
        const [rows] = await pool.query(query, [userId, deliveryId]);

        if (rows.length === 0) {
            // 결과가 없으면 404 응답 반환
            return new Response(JSON.stringify({ error: 'No matching item found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 성공 응답
        return new Response(JSON.stringify(rows[0]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Database query error:', error);

        // 서버 에러 반환
        return new Response(JSON.stringify({ error: 'Failed to fetch item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function getAllItem() {
    try {
        const query = `SELECT * FROM ITEMLIST`;
        const [rows] = await pool.query(query);

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Databasequery error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch items' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}