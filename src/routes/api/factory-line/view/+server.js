import pool from '$lib/server/db.js';

export async function GET() {
    try {
        const query = `
        SELECT * FROM FACTORYLINEVIEW `;

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
        return new Response(JSON.stringify({ error: 'Failed to fetch todos' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}