export type ActionSuccess<T = undefined> = {
    success: true;
    code: "OK";
    message: string;
    data?: T;
};

export type ActionFailure = {
    success: false;
    code: string;
    message: string;
    error: string;
};

export type ActionResult<T = undefined> = ActionSuccess<T> | ActionFailure;

export function ok<T = undefined>(message = "Operação concluída com sucesso.", data?: T): ActionSuccess<T> {
    return {
        success: true,
        code: "OK",
        message,
        data,
    };
}

export function fail(code: string, message: string): ActionFailure {
    return {
        success: false,
        code,
        message,
        error: message,
    };
}

