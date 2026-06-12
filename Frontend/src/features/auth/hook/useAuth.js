import { setError, setLoading, setUser } from "../state/auth.slice";
import { getMe, login, register } from "../service/auth.api";
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"


export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({ email, password, contact, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await register({ email, password, contact, fullname, isSeller })

            dispatch(setUser(data.user))
            toast.success("Account created successfully!")
            return data.user
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Registration failed"
            dispatch(setError(message))
            toast.error(message)
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await login({ email, password })
            dispatch(setUser(data.user))
            toast.success("Logged in successfully!")
            return data.user
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Login failed"
            dispatch(setError(message))
            toast.error(message)
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
                console.log(error);
                
        }

        finally {

            dispatch(setLoading(false))
        }
    }

    return { handleRegister, handleLogin, handleGetMe }
}