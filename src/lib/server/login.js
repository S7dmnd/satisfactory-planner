// src/lib/server/login.js
import pool from '$lib/server/db.js'; // MySQL 연결
import bcrypt from 'bcrypt'; // 비밀번호 해싱/검증
import jwt from 'jsonwebtoken'; // JWT 생성
import { v4 as uuidv4 } from 'uuid'; // UUID 생성

export const SECRET_KEY = 'super_secret'; // JWT 암호화 키
export const TOKEN_EXPIRY = '1d'; // JWT 만료 시간 설정
export const SALT_ROUND = 10;

export async function loginApi({ request }) {
    try {
        // 클라이언트에서 보낸 데이터를 파싱
        const { username, password } = await request.json();

        // SQL 쿼리문 (Prepared Statement로 작성)
        const query = 'SELECT USERID, PASSWORD FROM USER WHERE USERNAME = ?';
        const [rows] = await pool.execute(query, [username]);

        if (rows.length === 0) {
            // 사용자 존재하지 않음
            return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = rows[0]; // 첫 번째 사용자 정보

        const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // JWT 생성 (USERID 포함)
        const token = jwt.sign({ userId: user.USERID }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });

        // 성공 응답 (JWT 반환)
        return new Response(JSON.stringify({ token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Database query error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process login' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function login(username, password) {
    try {
        // SQL 쿼리문 (Prepared Statement로 작성)
        const query = 'SELECT USERID, PASSWORD FROM USER WHERE USERNAME = ?';
        const [rows] = await pool.execute(query, [username]);

        if (rows.length === 0) {
            return { success: false, error: 'Invalid username or password' };
        }

        const user = rows[0]; // 첫 번째 사용자 정보

        // 비밀번호 검증
        // const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
        // console.log(hashedPassword);
        const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
        if (!isPasswordValid) {
            return { success: false, error: 'Invalid username or password' };
        }

        // JWT 생성 (USERID 포함)
        const token = jwt.sign({ userId: user.USERID }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });

        // 성공 결과 반환
        return { success: true, token };
    } catch (error) {
        console.error('Database query error:', error);
        return { success: false, error: 'Failed to process login' };
    }
}

export async function validateUserId(userId) {
    try {
        // SQL 쿼리문: USERID가 존재하는지 확인
        const query = 'SELECT 1 FROM USER WHERE USERID = ?';
        const [rows] = await pool.execute(query, [userId]);

        // rows 배열이 비어 있지 않으면 USERID가 존재
        return rows.length > 0;
    } catch (error) {
        console.error('Database query error:', error);
        return false; // 에러 발생 시 false 반환
    }
}

export async function signUp(username, password) {
    try {
        // 1. SELECT * FROM USER WHERE USERNAME = username으로 USERNAME 중복 확인
        const checkQuery = 'SELECT * FROM USER WHERE USERNAME = ?';
        const [rows] = await pool.query(checkQuery, [username]);

        if (rows.length > 0) {
            return { success: false, error: 'Username already exists', usernameRedundancy: true };
        }

        // 2. UUID 생성
        const userId = uuidv4();

        // 3. 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

        // 4. USER 테이블에 데이터 저장
        const insertQuery = 'INSERT INTO USER (USERID, USERNAME, PASSWORD) VALUES (?, ?, ?)';
        await pool.query(insertQuery, [userId, username, hashedPassword]);

        console.log(`Account successfully registered with ID ${userId}, USERNAME ${username}`)

        return { success: true, message: 'User signed up successfully', userId };
    } catch (error) {
        console.error('Error in signUp:', error);
        return { success: false, error: 'Failed to sign up user' };
    }
}