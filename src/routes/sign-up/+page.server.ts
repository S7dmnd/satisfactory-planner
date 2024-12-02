import { signUp, login, validateUserId } from '$lib/server/login';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login'; // JWT 서명 키

// Form Action
// +page.svelte에서 method="POST"로 지정된 form 제출 시 실행되는 함수

export const actions = {
    signUp: async ({ request, cookies, url }) => {
        try {
            // Form 데이터 파싱
            const formData = await request.formData();
            const username = formData.get('username');
            const password = formData.get('password');

            if (!username || !password) {
                return fail(400, { missingRequirements: true });
            }

            // signUp 함수 호출
            const signUpResult = await signUp(username, password);

            if (!signUpResult.success && signUpResult?.usernameRedundancy) {
                console.log(signUpResult.error);
                return fail(401, { usernameRedundancy: true });
            } else if (!signUpResult.success) {
                console.log(signUpResult.error);
                return fail(401, { errorFromSignUp: true })
            }

            const LoginResult = await login(username, password);

            // JWT 쿠키 설정
            cookies.set('jwt', LoginResult.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/',
            });

            console.log('JWT Token:', LoginResult.token);

        } catch (error) {
            console.error('Signup-Login action error:', error);
            return fail(500, { error: 'An unexpected error occurred. Please try again.' });
        }

        redirect(303, url.searchParams.get('redirectTo') ?? '/factory-line');
    },
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies, url }) => {
    let userId = '';
    try {
        // JWT 가져오기
        const token = cookies.get('jwt');


        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
        console.log(`Decoded userId from JWT: ${decoded.userId}`);
        userId = decoded.userId;

    } catch (error) {
        console.error(`JWT validation error at /: ${error}`);
    }

    // JWT 검증
    const isValidUser = await validateUserId(userId);
    if (isValidUser) {
        //console.log(isValidUser);
        redirect(303, url.searchParams.get('redirectTo') ?? '/factory-line');
        //존나 웃긴게 이새끼는 작동함 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
    }
};