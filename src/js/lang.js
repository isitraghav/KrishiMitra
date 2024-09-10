import { writable } from "svelte/store";

export const lang = writable("en");

export const strings = {
    en: {
        title: "KrishiMitra",
        login: "Login",
        submit: "Submit",
        logout: "Logout",
        register: "Register",
        username: "Username",
        password: "Password",
        confirmPassword: "Confirm Password",
        email: "Email",
        name: "Name",
        phone: "Phone",
        address: "Address",
        city: "City",
    },
    hi: {
        title: "KrishiMitra",
        login: "लॉग इन",
        submit: "प्रस्तुत",
        logout: "लॉग आउट",
        register: "रजिस्टर",
        username: "उपयोगकर्ता नाम",
        password: "पासवर्ड",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        email: "ईमेल",
        name: "नाम",
        phone: "फ़ोन नंबर",
        address: "पता",
        city: "शहर",
    }
};