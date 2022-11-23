import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import Router from 'next/router';
import { api } from '../service/api';
import { setCookie, parseCookies, destroyCookie } from 'nookies'


import jwt_decode from "jwt-decode";



type User = {
   username: string,
   balance: number
}

type SiginInCredentials = {
    username: string
    password: string
}


type AuthContexData = {
    signIn(credentials: SiginInCredentials): Promise<void>;
    isAuthenticated: boolean
    userLocal: User | null
    singnLogout: () => void
    routerMe: () => void

};

type AuthProviderProps = {
    children: ReactNode
}
export const AuthContex = createContext({} as AuthContexData)

export function AuthProvider({ children }: AuthProviderProps) {
    const [userLocal, setUserLocal] = useState<User | null>(null)
    const [isLoading, SetIsloading] = useState(true)
    const isAuthenticated = !!userLocal;

    function routerMe() {
            api.get('/me').then(function (response) {
                const user = response.data
                console.log(user.account.balance)
                setUserLocal({  
                   username:user.username,
                   balance:user.account.balance
                })
            }).catch(function (e) {

                singnLogout()
            })
        
    }
    function singnLogout() {
        destroyCookie(undefined, 'ng.token')
        Router.push('/')
    }


    async function signIn({ username, password }: SiginInCredentials) {

        await api.post('/login', {
            username,
            password,
        }).then(function (response) {
            const { username, accessToken,account } = response.data
            setUserLocal({
                username,
                balance : account.balance
            })

            setCookie(undefined, 'ng.token', accessToken, {
                maxAge: 60 * 60 * 24 * 30, //30days
                path: '/'
            })
            api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
            Router.push('/controll')

        })

    }


    return (
        <AuthContex.Provider value={{ signIn, isAuthenticated, userLocal, singnLogout, routerMe }}>
            {children}
        </AuthContex.Provider>
    )
}