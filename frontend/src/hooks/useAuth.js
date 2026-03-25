import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { has, isArray } from "lodash";
import { toast } from "react-toastify";

import { i18n } from "../translate/i18n";
import api from "../services/api";
import toastError from "../errors/toastError";
import { SocketContext } from "../context/Socket/SocketContext";
import moment from "moment";
import { supabase } from "../services/supabase";

const useAuth = () => {
    const history = useHistory();
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    api.interceptors.request.use(
        async (config) => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                config.headers["Authorization"] = `Bearer ${session.access_token}`;
                setIsAuth(true);
            }
            return config;
        },
        (error) => {
            Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            if (error?.response?.status === 401) {
                // 401 = truly invalid/expired token, force logout
                await supabase.auth.signOut();
                setIsAuth(false);
            }
            // ALL 403 errors (pending approval, subscription expired, etc.)
            // are silently absorbed. The UI layout will handle the blocking screen.
            return Promise.reject(error);
        }
    );

    const socketManager = useContext(SocketContext);

    // Initialize session and listen for auth state changes
    useEffect(() => {
        let mounted = true;

        const loadSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                api.defaults.headers.Authorization = `Bearer ${session.access_token}`;
                try {
                    const { data } = await api.get("/auth/me");
                    if (mounted) {
                        setUser({ ...data, app_metadata: session.user.app_metadata });
                        setIsAuth(true);
                        localStorage.setItem("companyId", data.companyId);
                        localStorage.setItem("userId", data.id);
                    }
                } catch (err) {
                    if (err.response?.status === 403) {
                       if (mounted) {
                           setUser({ app_metadata: session.user.app_metadata });
                           setIsAuth(true); 
                       }
                    } else {
                       await supabase.auth.signOut();
                       if (mounted) {
                           setIsAuth(false);
                           setUser({});
                       }
                       localStorage.removeItem("companyId");
                       localStorage.removeItem("userId");
                    }
                }
            }
            if (mounted) setLoading(false);
        };

        loadSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
               loadSession();
            } else if (event === 'SIGNED_OUT') {
               setIsAuth(false);
               setUser({});
               localStorage.removeItem("companyId");
               localStorage.removeItem("userId");
               localStorage.removeItem("cshow");
               api.defaults.headers.Authorization = undefined;
            }
        });

        return () => {
            mounted = false;
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    useEffect(() => {
        const companyId = localStorage.getItem("companyId");
        if (companyId && isAuth && user.id) {
            const socket = socketManager.getSocket(companyId);

            socket.on(`company-${companyId}-user`, (data) => {
                if (data.action === "update" && data.user.id === user.id) {
                    setUser(data.user);
                }
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [socketManager, user, isAuth]);

    const handleLogin = async (userData) => {
        setLoading(true);

        try {
            const { data: supaData, error } = await supabase.auth.signInWithPassword({
                email: userData.email,
                password: userData.password
            });

            if (error) {
                toastError(error);
                setLoading(false);
                return;
            }

            // Successfully logged in via Supabase, now fetch local profile
            api.defaults.headers.Authorization = `Bearer ${supaData.session.access_token}`;
            
            try {
                const { data } = await api.get("/auth/me");
                
                const { companyId, id, company } = data;

                if (has(company, "settings") && isArray(company.settings)) {
                    const setting = company.settings.find(
                        (s) => s.key === "campaignsEnabled"
                    );
                    if (setting && setting.value === "true") {
                        localStorage.setItem("cshow", null);
                    }
                }

                moment.locale('pt-br');
                const dueDate = company.dueDate;
                const vencimiento = moment(dueDate).format("DD/MM/yyyy");

                var diff = moment(dueDate).diff(moment().format());
                var before = moment().isBefore(dueDate);
                var dias = moment.duration(diff).asDays();

                localStorage.setItem("companyId", companyId);
                localStorage.setItem("userId", id);
                localStorage.setItem("companyDueDate", vencimiento);

                setUser({ ...data, app_metadata: supaData.session.user.app_metadata });
                setIsAuth(true);
                toast.success(i18n.t("auth.toasts.success"));
                
                if (Math.round(dias) < 5 && before === true) {
                    toast.warn(`Tu suscripción vence en ${Math.round(dias)} ${Math.round(dias) === 1 ? 'día' : 'días'} `);
                }
                
                history.push("/tickets");
            } catch (err) {
                 if (err.response?.status === 403) {
                     setUser({ app_metadata: supaData.session.user.app_metadata });
                     setIsAuth(true); 
                     history.push("/tickets");
                 } else {
                     toastError(err);
                 }
            }
            setLoading(false);

        } catch (err) {
            toastError(err);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await api.delete("/auth/logout");
        } catch(e) {}
        
        try {
            await supabase.auth.signOut();
            setIsAuth(false);
            setUser({});
            localStorage.removeItem("companyId");
            localStorage.removeItem("userId");
            localStorage.removeItem("cshow");
            api.defaults.headers.Authorization = undefined;
            setLoading(false);
            history.push("/login");
        } catch (err) {
            toastError(err);
            setLoading(false);
        }
    };

    const getCurrentUserInfo = async () => {
        try {
            const { data } = await api.get("/auth/me");
            return data;
        } catch (err) {
            toastError(err);
        }
    };

    return {
        isAuth,
        user,
        loading,
        handleLogin,
        handleLogout,
        getCurrentUserInfo,
    };
};

export default useAuth;
