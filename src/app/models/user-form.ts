import { FormControl } from "@angular/forms";


export interface UserForm{
    id: number| null;
    username: FormControl<string>;
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    genre: FormControl<string>;
    password: FormControl<string>;
}
