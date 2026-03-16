export type AdminCredentialsInput = {
    username: string;
    password: string;
};

export type AdminCredentials = {
    username: string;
    password: string;
};

export function validateAdminCredentials(input: AdminCredentialsInput): {
    valid: boolean;
    data?: AdminCredentials;
    error?: string;
} {
    const username = input.username.trim();
    const password = input.password;

    if (!username || username.length < 3) {
        return { valid: false, error: "Usuário inválido." };
    }

    if (!password || password.length < 6) {
        return { valid: false, error: "Senha inválida." };
    }

    return {
        valid: true,
        data: {
            username,
            password,
        },
    };
}

