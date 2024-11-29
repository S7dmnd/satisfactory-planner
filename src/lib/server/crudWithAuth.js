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