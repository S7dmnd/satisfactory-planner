// src/routes/api/getTodo/+server.js
import pool from '$lib/server/db.js';

export async function GET() {
    try {
        const query = `
        SELECT
			FL.ROWID,
			FL.TODOAMOUNT,
			FAL.FACTORYNAME,
			IL_IN1.KO AS INITEMNAME1,
			RL.INAMOUNT1,
			IL_IN2.KO AS INITEMNAME2,
			RL.INAMOUNT2,
			IL_IN3.KO AS INITEMNAME3,
			RL.INAMOUNT3,
			IL_IN4.KO AS INITEMNAME4,
			RL.INAMOUNT4,
			IL_OUT1.KO AS OUTITEMNAME1,
			RL.OUTAMOUNT1,
			IL_OUT2.KO AS OUTITEMNAME2,
			RL.OUTAMOUNT2
			FROM FACTORYLINE FL
			JOIN FACTORYLIST FAL ON FAL.FACTORYID = FL.FACTORYID
			JOIN RECIPELIST RL ON RL.RECIPEKEY = FL.RECIPEKEY
			LEFT JOIN ITEMLIST IL_IN1 ON IL_IN1.ITEMKEY = RL.INITEM1
			LEFT JOIN ITEMLIST IL_IN2 ON IL_IN2.ITEMKEY = RL.INITEM2
			LEFT JOIN ITEMLIST IL_IN3 ON IL_IN3.ITEMKEY = RL.INITEM3
			LEFT JOIN ITEMLIST IL_IN4 ON IL_IN4.ITEMKEY = RL.INITEM4
			LEFT JOIN ITEMLIST IL_OUT1 ON IL_OUT1.ITEMKEY = RL.OUTITEM1
			LEFT JOIN ITEMLIST IL_OUT2 ON IL_OUT2.ITEMKEY = RL.OUTITEM2
			WHERE FL.TODOAMOUNT > 0 AND FL.TODOAMOUNT IS NOT NULL;
        `;

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

export async function PATCH({ request }) {
    try {
        // 요청 본문에서 ROWID 리스트를 가져옵니다.
        const { checkedTodoList } = await request.json();

        if (!Array.isArray(checkedTodoList) || checkedTodoList.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Invalid input: checkedTodoList must be a non-empty array.' }), { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SQL IN 절에 사용하기 위해 ROWID 리스트를 문자열로 변환합니다.
        const placeholders = checkedTodoList.map(() => '?').join(', ');
        const query = `UPDATE FACTORYLINE SET TODOAMOUNT = 0 WHERE ROWID IN (${placeholders})`;

        // 쿼리 실행
        const [result] = await pool.execute(query, checkedTodoList);

        return new Response(
            JSON.stringify({ message: 'TODOAMOUNT updated successfully.', affectedRows: result.affectedRows }), { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error updating TODOAMOUNT:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update TODOAMOUNT.' }), { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}