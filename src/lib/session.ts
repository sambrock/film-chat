// // import 'use-server'; // TODO: doesn't work when imported into convex, need to fix

// import { cookies } from 'next/headers';
// import { jwtVerify, SignJWT } from 'jose';
// import { JwtPayload } from 'jsonwebtoken';

// export type SessionPayload = {
//   userId: string;
//   anon: boolean;
// };

// const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

// export const encryptSession = async (payload: SessionPayload) => {
//   return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().sign(encodedKey);
// };

// export const decryptSession = async (session: string | undefined = '') => {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ['HS256'],
//     });
//     return payload as JwtPayload & SessionPayload;
//   } catch (error) {
//     console.log('Failed to verify session');
//   }
// };

// export const createSession = async (payload: SessionPayload) => {
//   const session = await encryptSession(payload);
//   const cookieStore = await cookies();

//   cookieStore.set('session', session, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'lax',
//     path: '/',
//   });

//   return session;
// };

// export const readSession = async () => {
//   const cookieStore = await cookies();

//   const session = cookieStore.get('session')?.value;
//   if (!session) {
//     return null;
//   }

//   return session;
// };
