import { AxiosError } from "axios";

export function getErrorMessage(e: AxiosError | any): string {
    if (e instanceof AxiosError) {
        return e.response?.data.error || e.response?.data.message || e.message;
    } else {
        if (e.message)
            return e.message;
        try {
            let data = JSON.parse(e);
            if (data.error) {
                return data.error;
            }else{
                return "Something went terribly wrong";
            }
        } catch (e) {
            return "Something went extremely wrong";
        }
    }
}
