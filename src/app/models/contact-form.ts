import { FormControl } from "@angular/forms";

export interface contactForm{
    id: number;
    firstName: FormControl <string>;
    lastName: FormControl <string>;
    genre: FormControl <string>;
}