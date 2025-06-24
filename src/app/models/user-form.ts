import { FormControl } from "@angular/forms";

export interface userForm{
    id: number | null;
    firstname: FormControl <string | null>;
    lastname: FormControl <string | null>;
    genre: FormControl <string | null>;
}