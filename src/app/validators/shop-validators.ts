import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {
    static notOnlyWhitespace(control: FormControl) : null | ValidationErrors {
        if (control.value != null && control.value.trim().length === 0) {
            return {'notOnlyWhitespace': true};
        }
        return null;
    }
}
