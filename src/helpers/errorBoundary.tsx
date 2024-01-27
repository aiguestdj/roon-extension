import { showError } from "src/components/ErrorProvider/ErrorProvider";
import { getErrorMessage } from "./getErrorMessage";

export async function errorBoundary(toRun: Function, onError?: Function, blockError?: boolean) {
        try {
            await toRun();
        } catch (err) {
            if (typeof onError == 'function') {
                try {
                    onError(err);
                } catch (e) { }
            }
            if (!blockError)
                showError(getErrorMessage(err));
        }
}
