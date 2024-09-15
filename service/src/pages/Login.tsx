import { Button, Card, CardBody, Divider, Input, Skeleton, Spinner } from "@nextui-org/react"
import { AuthCredentials, FrappeError, UserPassCredentials, useFrappeAuth } from "frappe-react-sdk"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"




const LoginForm = (): JSX.Element => {

    const {
        currentUser,
        isValidating,
        isLoading,
        login,
        logout,
        error,
        updateCurrentUser,
        getUserCookie,

    } = useFrappeAuth()

    const [isLogin, setIsLogin] = useState(false)

    const [credential, setCredential] = useState({
        username: '',
        password: "",
    } as UserPassCredentials);

    const [loginError, setLoginError] = useState({
        message: ''
    } as FrappeError)

    const doLogin = async () => {

        await isLoginWrapper(async () => {
            try {
                setLoginError({ message: '' } as FrappeError)
                let result = await login(credential)
                console.log('doLogin result', result)
            } catch (error) {
                console.log('doLogin error', error)
                setLoginError(error as FrappeError)
            }
        })
    }
    const isLoginWrapper = async (callback: { (): Promise<void>; (): any }) => {
        setIsLogin(true)
        await callback()
        setIsLogin(false)
    }

    const doLogout = async () => {
        await isLoginWrapper(async () => {
            let result = await logout()
            console.log(result)
        })
    }
    const handleCredential = (key: string, value: string) => {
        setCredential({
            ...credential,
            [key]: value
        })
    }
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser) {
            updateCurrentUser().then(r => {
                console.log("useeffect updatecurrentuser", r)
                setTimeout(() => {
                    navigate("/")
                }, 3000)
            })
        }
    },
        [currentUser])

    if (isLoading) {
        return (
            <Card className="min-w-[300px] max-w-[350px]">
                <CardBody className="flex flex-col gap-3 justify-center items-center">
                    <Spinner size="lg" />
                </CardBody>
            </Card>
        )

    } else {
        if (currentUser) {
            return (
                <Card className="min-w-[300px] max-w-[350px]">
                    <CardBody className="flex flex-col gap-3 justify-center items-center">
                        <div>สวัสดี {currentUser}</div>
                        <Spinner size="lg"></Spinner>
                        <div>กำลังเข้าสู่ระบบ</div>
                    </CardBody>
                </Card>

            )
        } else {
            return (
                <form onSubmit={doLogin}>
                    <Card className="min-w-[300px] max-w-[350px]">
                        <CardBody className="flex flex-col gap-3 justify-center items-center">
                            <div>สวัสดี กรุณาเข้าสู่ระบบ</div>
                            <Input
                                isInvalid={loginError?.message != ''}
                                color={loginError?.message != '' ? "danger" : "default"}
                                errorMessage={loginError?.message}
                                type="email" label="ชื่อผู้ใช้/อีเมล์/เบอร์โทรฯ" value={credential.username} placeholder="กรุณากรอกข้อมูล" name="username" onValueChange={(value) => handleCredential('username', value)} />
                            <Input
                                onSubmit={doLogin}
                                isInvalid={loginError?.message != ''}
                                color={loginError?.message != '' ? "danger" : "default"}
                                errorMessage={loginError?.message}

                                type="password" label="รหัสผ่าน" defaultValue={credential.password} placeholder="กรุณากรอกรหัสผ่าน" name="password" onValueChange={(value) => handleCredential('password', value)} />
                            <Button type="submit" className="w-full" color="primary" isLoading={isLogin} onClick={doLogin}>
                                เข้าสู่ระบบ
                            </Button>

                            <Divider></Divider>

                            <Button type="button" className="w-full" color="default" isLoading={isLogin} onClick={() => { navigate("/register") }}>
                                สมัครสมาชิก
                            </Button>

                        </CardBody>
                    </Card>
                </form>

            )
        }
    }




}
function Login() {

    return (
        <div className="min-h-svh min-w-full flex items-center justify-center">
            <LoginForm />
        </div>
    )
}

export default Login