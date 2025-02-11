import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {
    static notOnlyWhitespace(control: FormControl) : null | ValidationErrors {
        if (control.value != null && control.value.trim().length === 0) {
            return {'notOnlyWhitespace': true};
        }
        return null;
    }

    static passwordMisMatch(control: FormControl) : null | ValidationErrors {
        const password = control.get('password');
        const rePassword = control.get('rePassword');
        if (password && rePassword && password.value !== rePassword.value) {
            return {'passwordMisMatch': true};
        }
        return null;
    }
}
