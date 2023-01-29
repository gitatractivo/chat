import { PrismaClient } from '@prisma/client';
import { ISODateString } from 'next-auth';
export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient


}

export interface Session{
    user: User,
    expires: ISODateString
}


export interface User{
    id: string,
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    username?: string,
    emailVerified: boolean
}

export interface CreateUsernameResonse{
    success?: boolean,
    error?: string | null,
}